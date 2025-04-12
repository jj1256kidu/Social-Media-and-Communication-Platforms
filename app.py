import streamlit as st
import pandas as pd
from datetime import datetime
import random
import json
from streamlit_lottie import st_lottie
import requests
import time

# Initialize session state
if 'posts' not in st.session_state:
    st.session_state.posts = []
if 'current_user' not in st.session_state:
    st.session_state.current_user = None
if 'categories' not in st.session_state:
    st.session_state.categories = [
        {
            'id': '1',
            'name': '💬 General',
            'description': 'Talk about anything and everything',
            'icon': '💬',
            'color': '#00C6FF'
        },
        {
            'id': '2',
            'name': '💻 Tech',
            'description': 'Latest tech news and discussions',
            'icon': '💻',
            'color': '#8F00FF'
        },
        {
            'id': '3',
            'name': '😂 Humor',
            'description': 'Funny stories and memes',
            'icon': '😂',
            'color': '#39FF14'
        },
        {
            'id': '4',
            'name': '🎓 Education',
            'description': 'Learning and knowledge sharing',
            'icon': '🎓',
            'color': '#FF6B6B'
        }
    ]

# Load Lottie animations
def load_lottieurl(url: str):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

lottie_coding = load_lottieurl("https://assets5.lottiefiles.com/packages/lf20_fcfjwiyb.json")
lottie_login_success = load_lottieurl("https://assets5.lottiefiles.com/packages/lf20_hu9cd9.json")
lottie_typing = load_lottieurl("https://assets5.lottiefiles.com/packages/lf20_yyjaqn.json")
lottie_send = load_lottieurl("https://assets5.lottiefiles.com/packages/lf20_8w5pns.json")

# Custom CSS with animations
st.markdown("""
<style>
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(0,198,255,0.5); }
        50% { box-shadow: 0 0 20px rgba(0,198,255,0.8); }
        100% { box-shadow: 0 0 5px rgba(0,198,255,0.5); }
    }
    .stApp {
        background-color: #0F1117;
        color: #ffffff;
    }
    .login-container {
        animation: float 6s ease-in-out infinite;
    }
    .post-card {
        background-color: #1E1E2E;
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .post-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.2);
        animation: glow 2s infinite;
    }
    .category-card {
        background-color: #1E1E2E;
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }
    .category-card:hover {
        transform: translateY(-5px);
        animation: glow 2s infinite;
    }
    .vote-button {
        background-color: #2D2D3D;
        border: none;
        border-radius: 8px;
        padding: 8px 15px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .vote-button:hover {
        background-color: #3D3D4D;
        transform: scale(1.1);
    }
    .vote-button:active {
        transform: scale(1.3);
        background-color: #39FF14;
    }
    .stButton>button {
        background-color: #00C6FF;
        color: #0F1117;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        background-color: #00FF9F;
        transform: translateY(-2px);
    }
    .stTextInput>div>div>input {
        background-color: #1E1E2E;
        color: #ffffff;
        border: 1px solid #3D3D4D;
        transition: all 0.3s ease;
    }
    .stTextInput>div>div>input:focus {
        border-color: #00C6FF;
        box-shadow: 0 0 10px rgba(0,198,255,0.5);
    }
    .stTextArea>div>div>textarea {
        background-color: #1E1E2E;
        color: #ffffff;
        border: 1px solid #3D3D4D;
        transition: all 0.3s ease;
    }
    .stTextArea>div>div>textarea:focus {
        border-color: #00C6FF;
        box-shadow: 0 0 10px rgba(0,198,255,0.5);
    }
    .stSelectbox>div>div>div {
        background-color: #1E1E2E;
        color: #ffffff;
    }
    .stMarkdown {
        color: #ffffff;
    }
    .stExpander {
        background-color: #1E1E2E;
        border-radius: 15px;
        transition: all 0.3s ease;
    }
    .stForm {
        background-color: #1E1E2E;
        border-radius: 15px;
        padding: 20px;
    }
    .avatar-ring {
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #00C6FF;
        animation: pulse 2s infinite;
    }
    .avatar-ring::before {
        content: '';
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border: 2px solid #00C6FF;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
    .progress-bar {
        height: 5px;
        background: #1E1E2E;
        border-radius: 5px;
        margin-top: 10px;
    }
    .progress-bar-fill {
        height: 100%;
        background: #00C6FF;
        border-radius: 5px;
        transition: width 0.3s ease;
    }
</style>
""", unsafe_allow_html=True)

# Login Page
if not st.session_state.current_user:
    col1, col2 = st.columns([1, 1])
    with col1:
        st.markdown('<div class="login-container">', unsafe_allow_html=True)
        st.title("Welcome to ForumHub")
        st.markdown("A modern forum for tech enthusiasts")
        if lottie_coding:
            st_lottie(lottie_coding, height=300, key="coding")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.header("Login")
        with st.form("login_form"):
            username = st.text_input("Username")
            password = st.text_input("Password", type="password")
            submitted = st.form_submit_button("Login")
            
            if submitted:
                if username == "testuser" and password == "pass123":
                    st.session_state.current_user = {
                        'id': str(random.randint(1, 1000)),
                        'username': username,
                        'bio': "Tech enthusiast. Love to share thoughts.",
                        'karma': 1234,
                        'threads': 4,
                        'comments': 9,
                        'level': "Influencer"
                    }
                    st.success("Login successful!")
                    if lottie_login_success:
                        st_lottie(lottie_login_success, height=150, key="login_success")
                    st.balloons()
                    time.sleep(2)  # Show success animation
                    st.experimental_rerun()
                else:
                    st.error("Invalid credentials")

# Main App (After Login)
else:
    # Header
    st.title("ForumHub")
    st.markdown("---")
    
    # Sidebar
    with st.sidebar:
        st.markdown('<div class="avatar-ring"></div>', unsafe_allow_html=True)
        st.header(f"👤 {st.session_state.current_user['username']}")
        st.markdown(f"**Level:** {st.session_state.current_user['level']}")
        st.markdown(f"**Karma:** {st.session_state.current_user['karma']}")
        st.markdown(f"**Threads:** {st.session_state.current_user['threads']}")
        st.markdown(f"**Comments:** {st.session_state.current_user['comments']}")
        
        if st.button("Logout"):
            st.session_state.current_user = None
            st.experimental_rerun()
    
    # Search and Filters
    col1, col2 = st.columns([3, 1])
    with col1:
        search_query = st.text_input("🔍 Search posts...", key="search")
    with col2:
        filter_option = st.selectbox("Filter by", ["Recent", "Trending"])
    
    # Categories
    st.header("Categories")
    category_cols = st.columns(4)
    for i, category in enumerate(st.session_state.categories):
        with category_cols[i % 4]:
            st.markdown(f"""
            <div class="category-card">
                <h3>{category['icon']} {category['name']}</h3>
                <p>{category['description']}</p>
                <button class="vote-button">New Post</button>
            </div>
            """, unsafe_allow_html=True)
    
    # Posts
    st.header("Posts")
    if st.session_state.posts:
        for post in st.session_state.posts:
            st.markdown(f"""
            <div class="post-card">
                <h3>{post['title']}</h3>
                <p>{post['content']}</p>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="vote-button">⬆️ {post['upvotes']}</button>
                    <button class="vote-button">⬇️ {post['downvotes']}</button>
                    <span>💬 {len(post['comments'])} comments</span>
                    <span style="color: #00C6FF;">{post['author']}</span>
                    <span style="color: #666;">{post['created_at']}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("No posts yet. Be the first to create one!")
    
    # Create Post
    if st.session_state.current_user:
        with st.expander("➕ Create New Post", expanded=False):
            with st.form("new_post_form"):
                title = st.text_input("Title")
                content = st.text_area("Content", placeholder="Start typing your thoughts... |")
                if content:
                    progress = min(len(content) / 500 * 100, 100)
                    st.markdown(f"""
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: {progress}%"></div>
                    </div>
                    """, unsafe_allow_html=True)
                category = st.selectbox("Category", [c['name'] for c in st.session_state.categories])
                submitted = st.form_submit_button("Post")
                
                if submitted and title and content:
                    if lottie_send:
                        st_lottie(lottie_send, height=100, key="send")
                    new_post = {
                        'id': str(random.randint(1, 1000)),
                        'title': title,
                        'content': content,
                        'author': st.session_state.current_user['username'],
                        'category': category,
                        'upvotes': 0,
                        'downvotes': 0,
                        'comments': [],
                        'created_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    }
                    st.session_state.posts.append(new_post)
                    st.success("Post created successfully!")
                    st.balloons()
                    time.sleep(2)  # Show success animation
                    st.experimental_rerun() 
