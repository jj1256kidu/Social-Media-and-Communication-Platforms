import streamlit as st
import pandas as pd
from datetime import datetime
import random
import json
from streamlit_lottie import st_lottie
import requests

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

# Load Lottie animation
def load_lottieurl(url: str):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

lottie_coding = load_lottieurl("https://assets5.lottiefiles.com/packages/lf20_fcfjwiyb.json")

# Custom CSS
st.markdown("""
<style>
    .stApp {
        background-color: #0F1117;
        color: #ffffff;
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
    }
    .vote-button {
        background-color: #2D2D3D;
        border: none;
        border-radius: 8px;
        padding: 8px 15px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    .vote-button:hover {
        background-color: #3D3D4D;
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
    }
    .stTextArea>div>div>textarea {
        background-color: #1E1E2E;
        color: #ffffff;
        border: 1px solid #3D3D4D;
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
    }
    .stForm {
        background-color: #1E1E2E;
        border-radius: 15px;
        padding: 20px;
    }
</style>
""", unsafe_allow_html=True)

# Login Page
if not st.session_state.current_user:
    col1, col2 = st.columns([1, 1])
    with col1:
        st.title("Welcome to ForumHub")
        st.markdown("A modern forum for tech enthusiasts")
        if lottie_coding:
            st_lottie(lottie_coding, height=300, key="coding")
    
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
                    st.balloons()
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
                content = st.text_area("Content")
                category = st.selectbox("Category", [c['name'] for c in st.session_state.categories])
                submitted = st.form_submit_button("Post")
                
                if submitted and title and content:
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
                    st.experimental_rerun() 
