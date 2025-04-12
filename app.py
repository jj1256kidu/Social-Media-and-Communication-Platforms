import streamlit as st
import pandas as pd
from datetime import datetime
import random

# Initialize session state
if 'posts' not in st.session_state:
    st.session_state.posts = []
if 'current_user' not in st.session_state:
    st.session_state.current_user = None
if 'categories' not in st.session_state:
    st.session_state.categories = [
        {
            'id': '1',
            'name': 'Tech',
            'description': 'Discussions about technology, programming, and software development',
            'color': '#00C6FF'
        },
        {
            'id': '2',
            'name': 'Life',
            'description': 'Life advice, personal development, and general discussions',
            'color': '#8F00FF'
        },
        {
            'id': '3',
            'name': 'Humor',
            'description': 'Funny stories, memes, and light-hearted content',
            'color': '#39FF14'
        }
    ]

# Custom CSS
st.markdown("""
<style>
    .stApp {
        background-color: #f5f5f5;
    }
    .post-card {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .category-card {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .vote-button {
        background-color: #f0f0f0;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
    }
    .vote-button:hover {
        background-color: #e0e0e0;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.title("ForumHub")
st.markdown("---")

# Login Section
if not st.session_state.current_user:
    with st.sidebar:
        st.header("Login")
        username = st.text_input("Username")
        if st.button("Login"):
            st.session_state.current_user = {
                'id': str(random.randint(1, 1000)),
                'username': username,
                'karma': 0
            }
            st.success(f"Welcome, {username}!")
else:
    with st.sidebar:
        st.header(f"Welcome, {st.session_state.current_user['username']}")
        if st.button("Logout"):
            st.session_state.current_user = None
            st.experimental_rerun()

# Search and Filters
col1, col2 = st.columns([3, 1])
with col1:
    search_query = st.text_input("Search posts...", key="search")
with col2:
    filter_option = st.selectbox("Filter by", ["Recent", "Trending"])

# Categories
st.header("Categories")
category_cols = st.columns(3)
for i, category in enumerate(st.session_state.categories):
    with category_cols[i % 3]:
        st.markdown(f"""
        <div class="category-card">
            <h3>{category['name']}</h3>
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
            </div>
        </div>
        """, unsafe_allow_html=True)
else:
    st.info("No posts yet. Be the first to create one!")

# Create Post
if st.session_state.current_user:
    with st.expander("Create New Post"):
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
                st.experimental_rerun() 
