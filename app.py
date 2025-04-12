import streamlit as st
import pandas as pd
from datetime import datetime
import json
import os

# Initialize session state
if 'posts' not in st.session_state:
    st.session_state.posts = []
if 'current_user' not in st.session_state:
    st.session_state.current_user = None
if 'categories' not in st.session_state:
    st.session_state.categories = [
        {
            'id': '1',
            'name': 'General Discussion',
            'description': 'Talk about anything and everything',
            'icon': '💬'
        },
        {
            'id': '2',
            'name': 'Technology',
            'description': 'Latest tech news and discussions',
            'icon': '💻'
        },
        {
            'id': '3',
            'name': 'Gaming',
            'description': 'Video games and gaming culture',
            'icon': '🎮'
        }
    ]

# Custom CSS
st.markdown("""
<style>
    .stApp {
        background-color: #0a0a0f;
        color: #ffffff;
    }
    .stButton>button {
        background-color: #00f3ff;
        color: #0a0a0f;
        border: none;
        border-radius: 5px;
        padding: 0.5rem 1rem;
    }
    .stButton>button:hover {
        background-color: #00ff9f;
    }
    .post-card {
        background-color: #1a1a2e;
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    .category-card {
        background-color: #1a1a2e;
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    .neon-text {
        color: #00f3ff;
        text-shadow: 0 0 5px #00f3ff;
    }
</style>
""", unsafe_allow_html=True)

# Functions
def handle_login(username):
    st.session_state.current_user = {
        'id': '2',
        'username': username,
        'avatar': '👤'
    }

def handle_vote(post_id, is_upvote):
    for post in st.session_state.posts:
        if post['id'] == post_id:
            if is_upvote:
                post['upvotes'] += 1
            else:
                post['downvotes'] += 1

def handle_create_post(title, content, category):
    if not st.session_state.current_user:
        return

    new_post = {
        'id': str(datetime.now().timestamp()),
        'title': title,
        'content': content,
        'author': st.session_state.current_user,
        'category': category,
        'upvotes': 0,
        'downvotes': 0,
        'comments': [],
        'createdAt': datetime.now().isoformat()
    }

    st.session_state.posts.append(new_post)

def handle_add_comment(post_id, content):
    if not st.session_state.current_user:
        return

    for post in st.session_state.posts:
        if post['id'] == post_id:
            new_comment = {
                'id': str(datetime.now().timestamp()),
                'content': content,
                'author': st.session_state.current_user,
                'upvotes': 0,
                'downvotes': 0,
                'createdAt': datetime.now().isoformat()
            }
            post['comments'].append(new_comment)

# Main App
st.title("Future Forum")
st.markdown("---")

# Login Section
if not st.session_state.current_user:
    username = st.text_input("Enter your username to login")
    if username:
        handle_login(username)
        st.success(f"Welcome, {username}!")
else:
    st.sidebar.markdown(f"### 👤 {st.session_state.current_user['username']}")

# Sidebar - Categories
st.sidebar.markdown("### Categories")
for category in st.session_state.categories:
    with st.sidebar.expander(f"{category['icon']} {category['name']}"):
        st.write(category['description'])

# Main Content
col1, col2 = st.columns([3, 1])

with col1:
    st.markdown("### Latest Posts")
    
    # Create Post Form
    if st.session_state.current_user:
        with st.expander("Create New Post"):
            with st.form("create_post_form"):
                title = st.text_input("Title")
                content = st.text_area("Content")
                category = st.selectbox(
                    "Category",
                    options=[cat['name'] for cat in st.session_state.categories]
                )
                submitted = st.form_submit_button("Post")
                if submitted and title and content:
                    handle_create_post(title, content, category)
                    st.success("Post created successfully!")

    # Display Posts
    for post in st.session_state.posts:
        with st.container():
            st.markdown(f"""
            <div class="post-card">
                <h3>{post['title']}</h3>
                <p>{post['content']}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span>{post['author']['avatar']} {post['author']['username']}</span>
                        <span> • {post['category']}</span>
                        <span> • {datetime.fromisoformat(post['createdAt']).strftime('%Y-%m-%d')}</span>
                    </div>
                    <div>
                        <button onclick="handleVote('{post['id']}', true)">👍 {post['upvotes']}</button>
                        <button onclick="handleVote('{post['id']}', false)">👎 {post['downvotes']}</button>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

            # Comments Section
            with st.expander(f"💬 Comments ({len(post['comments'])})"):
                for comment in post['comments']:
                    st.markdown(f"""
                    <div style="margin-left: 1rem; padding: 0.5rem; background-color: #262626; border-radius: 5px;">
                        <p>{comment['content']}</p>
                        <small>{comment['author']['avatar']} {comment['author']['username']}</small>
                    </div>
                    """, unsafe_allow_html=True)

                if st.session_state.current_user:
                    with st.form(f"comment_form_{post['id']}"):
                        comment_content = st.text_area("Add a comment")
                        submitted = st.form_submit_button("Comment")
                        if submitted and comment_content:
                            handle_add_comment(post['id'], comment_content)
                            st.experimental_rerun()

with col2:
    st.markdown("### Quick Stats")
    st.metric("Total Posts", len(st.session_state.posts))
    total_comments = sum(len(post['comments']) for post in st.session_state.posts)
    st.metric("Total Comments", total_comments)
    st.metric("Active Users", 1)  # Placeholder for actual user count 
