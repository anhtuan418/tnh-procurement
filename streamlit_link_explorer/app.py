import io
import re
import time
from collections import deque
from urllib.parse import urljoin, urlparse, urldefrag, parse_qsl, urlencode

import pandas as pd
import requests
import streamlit as st
from bs4 import BeautifulSoup

st.set_page_config(page_title="Link Explorer", page_icon="🔎", layout="wide")
st.title("Link Explorer")
st.caption("Nhập 1 URL gốc → tự tìm các link có thể click tiếp theo → chỉ giữ link mới → xuất CSV/Excel.")

DEFAULT_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129 Safari/537.36"
)

VIDEO_HINTS = [r"/video/", r"/videos/", r"/watch", r"/clip/", r"/movie/", r"/media/", r"\.mp4(?:$|\?)", r"\.webm(?:$|\?)", r"\.m3u8(?:$|\?)"]
ASSET_EXT = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".css", ".js", ".ico", ".woff", ".woff2", ".ttf", ".pdf", ".zip", ".rar", ".7z", ".mp3", ".wav")
TRACKING_PARAMS = {"utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid", "yclid", "mc_cid", "mc_eid"}

if "history" not in st.session_state:
    st.session_state.history = pd.DataFrame(columns=["canonical_url", "target_url", "anchor_text", "source_url", "type", "first_seen_at"])


def canonicalize_url(url: str) -> str:
    if not url:
        return ""
    url, _ = urldefrag(url.strip())
    p = urlparse(url)
    if p.scheme not in ("http", "https"):
        return ""
    host = p.netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    path = re.sub(r"/{2,}", "/", p.path or "/")
    if path != "/" and path.endswith("/"):
        path = path[:-1]
    clean_qs = [(k, v) for k, v in parse_qsl(p.query, keep_blank_values=True) if k.lower() not in TRACKING_PARAMS]
    clean_qs.sort()
    query = urlencode(clean_qs, doseq=True)
    return f"{p.scheme.lower()}://{host}{path}" + (f"?{query}" if query else "")


def normalize_url(base_url, href):
    if not href:
        return None
    href = href.strip()
    if href.startswith(("javascript:", "mailto:", "tel:", "#")):
        return None
    u = urljoin(base_url, href)
    u, _ = urldefrag(u)
    p = urlparse(u)
    return u if p.scheme in ("http", "https") else None


def same_domain(a, b):
    da = urlparse(a).netloc.lower().removeprefix("www.")
    db = urlparse(b).netloc.lower().removeprefix("www.")
    return da == db


def looks_like_video(url, text=""):
    blob = (url + " " + (text or "")).lower()
    return any(re.search(pat, blob, flags=re.I) for pat in VIDEO_HINTS)


def is_asset(url):
    return urlparse(url).path.lower().endswith(ASSET_EXT)


@st.cache_data(show_spinner=False, ttl=300)
def fetch_html(url, timeout=20):
    r = requests.get(url, timeout=timeout, headers={"User-Agent": DEFAULT_UA, "Accept-Language": "vi,en;q=0.8"}, allow_redirects=True)
    r.raise_for_status()
    ctype = (r.headers.get("content-type") or "").lower()
    if "text/html" not in ctype and "application/xhtml+xml" not in ctype:
        raise ValueError(f"Không phải HTML: {ctype or 'unknown'}")
    return r.url, r.text


def extract_links(page_url, html):
    soup = BeautifulSoup(html, "html.parser")
    out = []
    for a in soup.find_all("a", href=True):
        target = normalize_url(page_url, a.get("href"))
        if not target or is_asset(target):
            continue
        canon = canonicalize_url(target)
        if not canon:
            continue
        text = " ".join(a.stripped_strings)[:300]
        out.append({"source_url": page_url, "target_url": target, "canonical_url": canon, "anchor_text": text, "is_video_like": looks_like_video(target, text)})
    return out


with st.expander("Kho link đã có", expanded=False):
    uploaded = st.file_uploader("Nạp lịch sử cũ (CSV, tùy chọn)", type=["csv"])
    if uploaded is not None:
        try:
            old = pd.read_csv(uploaded)
            if "canonical_url" in old.columns:
                st.session_state.history = old.drop_duplicates(subset=["canonical_url"], keep="first")
                st.success(f"Đã nạp {len(st.session_state.history):,} URL")
            else:
                st.error("CSV phải có cột canonical_url")
        except Exception as e:
            st.error(str(e))
    st.write(f"Đang nhớ trong phiên: **{len(st.session_state.history):,} URL duy nhất**")
    if len(st.session_state.history):
        st.download_button("Tải lịch sử hiện tại", st.session_state.history.to_csv(index=False).encode("utf-8-sig"), "link_history.csv", "text/csv", use_container_width=True)
    if st.button("Xóa lịch sử trong phiên", use_container_width=True):
        st.session_state.history = st.session_state.history.iloc[0:0].copy()
        st.rerun()

url = st.text_input("URL gốc", placeholder="https://example.com/page")
c1, c2, c3, c4 = st.columns(4)
with c1:
    max_depth = st.number_input("Độ sâu", 1, 5, 2, 1)
with c2:
    max_pages = st.number_input("Số trang tối đa", 1, 500, 100, 10)
with c3:
    same_domain_only = st.checkbox("Chỉ cùng domain", True)
with c4:
    delay = st.number_input("Nghỉ giữa trang (giây)", 0.0, 5.0, 0.5, 0.1)

video_only = st.checkbox("Chỉ hiển thị link có vẻ là video/trang video", False)
run = st.button("Bắt đầu quét", type="primary", use_container_width=True)

if run:
    if not url or not url.startswith(("http://", "https://")):
        st.error("Hãy nhập URL hợp lệ bắt đầu bằng http:// hoặc https://")
        st.stop()

    root = url.strip()
    history_set = set(st.session_state.history["canonical_url"].dropna().astype(str))
    queue = deque([(root, 0)])
    visited_pages, seen_this_run = set(), set()
    new_rows, all_rows, errors = [], [], []
    progress = st.progress(0)
    status = st.empty()

    while queue and len(visited_pages) < max_pages:
        current, depth = queue.popleft()
        current_canon = canonicalize_url(current)
        if current_canon in visited_pages:
            continue
        if same_domain_only and not same_domain(root, current):
            continue
        visited_pages.add(current_canon)
        status.write(f"Đang quét {len(visited_pages)}/{max_pages}: {current}")
        try:
            final_url, html = fetch_html(current)
            for item in extract_links(final_url, html):
                canon = item["canonical_url"]
                if canon in seen_this_run:
                    continue
                seen_this_run.add(canon)
                item["depth"] = depth + 1
                item["same_domain"] = same_domain(root, item["target_url"])
                item["type"] = "VIDEO_LIKE" if item["is_video_like"] else "LINK"
                all_rows.append(item)
                if canon not in history_set:
                    new_rows.append(item)
                if depth + 1 < max_depth and ((not same_domain_only) or item["same_domain"]):
                    if canon not in visited_pages:
                        queue.append((item["target_url"], depth + 1))
        except Exception as e:
            errors.append({"url": current, "error": str(e)})
        progress.progress(min(100, int(len(visited_pages) / max_pages * 100)))
        if delay:
            time.sleep(delay)

    status.empty()
    progress.progress(100)
    new_df = pd.DataFrame(new_rows)
    all_df = pd.DataFrame(all_rows)

    if not new_df.empty:
        add_hist = new_df[["canonical_url", "target_url", "anchor_text", "source_url", "type"]].copy()
        add_hist["first_seen_at"] = pd.Timestamp.now().isoformat(timespec="seconds")
        st.session_state.history = pd.concat([st.session_state.history, add_hist], ignore_index=True).drop_duplicates(subset=["canonical_url"], keep="first")

    total_found = len(all_df)
    total_new = len(new_df)
    st.success(f"Đã quét {len(visited_pages)} trang • Phát hiện {total_found} URL duy nhất • **{total_new} link mới** • Bỏ qua {total_found-total_new} link đã có.")

    if not new_df.empty:
        tabs = st.tabs(["LINK MỚI", "VIDEO MỚI", "LỖI"])
        with tabs[0]:
            st.dataframe(new_df[["type", "anchor_text", "target_url", "source_url", "depth"]], use_container_width=True, hide_index=True)
        with tabs[1]:
            vdf = new_df[new_df["is_video_like"]].copy()
            st.dataframe(vdf[["anchor_text", "target_url", "source_url", "depth"]], use_container_width=True, hide_index=True)
        with tabs[2]:
            st.dataframe(pd.DataFrame(errors), use_container_width=True, hide_index=True) if errors else st.info("Không có lỗi")

        show_df = new_df[new_df["is_video_like"]].copy() if video_only else new_df.copy()
        st.download_button("Tải CSV link mới", show_df.to_csv(index=False).encode("utf-8-sig"), "new_links_only.csv", "text/csv", use_container_width=True)

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            new_df.to_excel(writer, sheet_name="NEW_LINKS", index=False)
            new_df[new_df["is_video_like"]].to_excel(writer, sheet_name="NEW_VIDEO_LINKS", index=False)
            pd.DataFrame(errors).to_excel(writer, sheet_name="ERRORS", index=False)
        st.download_button("Tải Excel link mới", output.getvalue(), "new_links_only.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", use_container_width=True)
    else:
        st.info("Không có link mới. Tất cả URL phát hiện được đã tồn tại trong kho lịch sử của phiên này.")

st.divider()
st.caption("Cloud mode: lịch sử chống trùng được giữ trong phiên. Muốn lưu qua lần khởi động lại, tải link_history.csv và nạp lại ở lần sau. App không vượt đăng nhập, CAPTCHA, paywall, DRM hoặc anti-bot.")
