import streamlit as st
import pandas as pd
from datetime import datetime
import random
import json
from streamlit_lottie import st_lottie
import requests
import time
import streamlit.components.v1 as components

# Initialize session state with dummy data
if 'posts' not in st.session_state:
    st.session_state.posts = [
        {
            'id': '1001',
            'category_id': '2',  # Tech category
            'title': '🚀 The Future of AI Development',
            'content': 'Artificial Intelligence is evolving rapidly. Here are my thoughts on where it\'s heading and what developers should focus on...',
            'author': 'tech_guru',
            'timestamp': '2024-03-15 10:30:00',
            'upvotes': 45,
            'downvotes': 3,
            'comments': [
                {'author': 'ai_fan', 'content': 'Great insights! AI is definitely changing everything.'},
                {'author': 'dev_123', 'content': 'Would love to hear more about ML applications.'}
            ]
        },
        {
            'id': '1002',
            'category_id': '3',  # Humor category
            'title': '😂 Programming Jokes Collection',
            'content': 'Why do programmers prefer dark mode? Because light attracts bugs! Share your favorite programming jokes...',
            'author': 'code_comedian',
            'timestamp': '2024-03-14 15:45:00',
            'upvotes': 72,
            'downvotes': 5,
            'comments': [
                {'author': 'bug_hunter', 'content': 'That was actually funny! Here\'s another one...'},
                {'author': 'java_lover', 'content': 'Classic! 😄'}
            ]
        },
        {
            'id': '1003',
            'category_id': '1',  # General category
            'title': '💡 Tips for Remote Work Success',
            'content': 'After 3 years of remote work, here are my top tips for staying productive and maintaining work-life balance...',
            'author': 'remote_pro',
            'timestamp': '2024-03-13 09:15:00',
            'upvotes': 38,
            'downvotes': 2,
            'comments': [
                {'author': 'wfh_expert', 'content': 'Great tips! I would also add...'},
                {'author': 'newbie_remote', 'content': 'This is exactly what I needed!'}
            ]
        }
    ]
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
if 'show_new_post_form' not in st.session_state:
    st.session_state.show_new_post_form = False
if 'selected_category' not in st.session_state:
    st.session_state.selected_category = None

# Add particles.js background
def add_particles_background():
    components.html("""
        <div id="particles-js"></div>
        <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
        <script>
            particlesJS.load('particles-js', 'https://raw.githubusercontent.com/VincentGarreau/particles.js/master/demo/particles.json');
        </script>
    """, height=0)

# Add theme switcher component
def theme_switcher():
    components.html("""
        <div class="theme-switcher">
            <select onchange="changeTheme(this.value)">
                <option value="pastel">🌈 Pastel</option>
                <option value="sunset">🌅 Sunset</option>
                <option value="space">🪐 Space</option>
            </select>
        </div>
        <script>
            function changeTheme(value) {
                let body = document.querySelector('.stApp');
                if (value === 'pastel') {
                    body.style.background = 'linear-gradient(120deg, #f9f9f9, #e0f7fa, #d0e1f9)';
                } else if (value === 'sunset') {
                    body.style.background = 'linear-gradient(120deg, #fbc2eb, #a6c1ee)';
                } else if (value === 'space') {
                    body.style.background = 'linear-gradient(120deg, #0f2027, #203a43, #2c5364)';
                }
                body.style.backgroundSize = '400% 400%';
                body.style.animation = 'gradientBG 15s ease infinite';
            }
        </script>
    """, height=0)

# Add confetti component
def trigger_confetti():
    components.html("""
        <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
        <script>
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        </script>
    """, height=0)

# Function to handle category selection
def handle_category_selection(category_id):
    st.session_state.selected_category = category_id
    st.rerun()

# Function to handle upvotes
def handle_upvote(post_id):
    for post in st.session_state.posts:
        if post['id'] == post_id:
            post['upvotes'] += 1
            return True
    return False

# Function to create new post
def create_new_post(category_id, title, content):
    new_post = {
        'id': str(random.randint(1000, 9999)),
        'category_id': category_id,
        'title': title,
        'content': content,
        'author': st.session_state.current_user['username'],
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'upvotes': 0,
        'downvotes': 0,
        'comments': []
    }
    if 'posts' not in st.session_state:
        st.session_state.posts = []
    st.session_state.posts.append(new_post)
    st.session_state.show_new_post_form = False
    st.session_state.selected_category = None

# Load Lottie animations
def load_lottieurl(url: str):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

lottie_login_success = load_lottieurl("https://assets3.lottiefiles.com/packages/lf20_hu9cd9.json")
lottie_typing = load_lottieurl("https://assets4.lottiefiles.com/packages/lf20_yyjaqn.json")
lottie_send = load_lottieurl("https://assets4.lottiefiles.com/packages/lf20_8w5pns.json")
lottie_wave = load_lottieurl("https://assets2.lottiefiles.com/private_files/lf30_WdTEui.json")

# Custom CSS with animations
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    * {
        font-family: 'Poppins', sans-serif;
    }
    
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
    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatUp {
        0% { opacity: 1; top: 0; }
        100% { opacity: 0; top: -30px; }
    }
    .stApp {
        background: linear-gradient(-45deg, #0F1117, #1E1E2E, #2D2D3D, #3D3D4D);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
        color: #ffffff;
    }
    .login-container {
        animation: float 6s ease-in-out infinite;
    }
    .login-card {
        background: rgba(30, 30, 46, 0.8);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }
    .login-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 198, 255, 0.2);
    }
    .login-card.shake {
        animation: shake 0.5s;
    }
    .input-container {
        position: relative;
        margin-bottom: 20px;
    }
    .input-field {
        width: 100%;
        padding: 15px;
        background: rgba(45, 45, 61, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        color: white;
        font-size: 16px;
        transition: all 0.3s ease;
    }
    .input-field:focus {
        outline: none;
        border-color: #00C6FF;
        box-shadow: 0 0 15px rgba(0, 198, 255, 0.3);
    }
    .input-label {
        position: absolute;
        left: 15px;
        top: 15px;
        color: #666;
        transition: all 0.3s ease;
        pointer-events: none;
    }
    .input-field:focus + .input-label,
    .input-field:not(:placeholder-shown) + .input-label {
        top: -10px;
        left: 10px;
        font-size: 12px;
        color: #00C6FF;
        background: #1E1E2E;
        padding: 0 5px;
    }
    .login-button {
        width: 100%;
        padding: 15px;
        background: linear-gradient(45deg, #00C6FF, #0072FF);
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    .login-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 198, 255, 0.4);
    }
    .login-button:active {
        transform: translateY(0);
    }
    .login-button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1, 1) translate(-50%);
        transform-origin: 50% 50%;
    }
    .login-button:active::after {
        animation: ripple 1s ease-out;
    }
    @keyframes ripple {
        0% {
            transform: scale(0, 0);
            opacity: 0.5;
        }
        100% {
            transform: scale(20, 20);
            opacity: 0;
        }
    }
    .forgot-password {
        text-align: right;
        margin-top: 10px;
    }
    .forgot-password a {
        color: #00C6FF;
        text-decoration: none;
        font-size: 14px;
        transition: all 0.3s ease;
    }
    .forgot-password a:hover {
        color: #0072FF;
    }
    .error-message {
        color: #FF6B6B;
        font-size: 14px;
        margin-top: 10px;
        animation: fadeIn 0.3s ease;
    }
    .brand-area {
        text-align: center;
        margin-bottom: 40px;
    }
    .brand-name {
        font-size: 36px;
        font-weight: 700;
        background: linear-gradient(45deg, #00C6FF, #0072FF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 10px;
    }
    .tagline {
        font-size: 18px;
        color: #666;
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
    .category-card {
        background: rgba(30, 30, 46, 0.8);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }
    .category-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 198, 255, 0.2);
    }
    .new-post-btn {
        background: linear-gradient(45deg, #00C6FF, #0072FF);
        color: white;
        padding: 8px 15px;
        border-radius: 8px;
        text-decoration: none;
        float: right;
        font-size: 14px;
        transition: all 0.3s ease;
    }
    .new-post-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 198, 255, 0.3);
    }
    .category-title {
        font-size: 24px;
        margin-bottom: 5px;
    }
    .category-description {
        color: #666;
        font-size: 14px;
    }
    /* Top Navigation Bar */
    .top-nav {
        background: rgba(30, 30, 46, 0.9);
        backdrop-filter: blur(10px);
        padding: 15px 20px;
        border-radius: 15px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .search-bar {
        background: rgba(45, 45, 61, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 8px 15px;
        width: 300px;
        color: white;
        animation: fadeIn 0.5s ease-out;
    }
    .profile-badge {
        background: linear-gradient(45deg, #00C6FF, #0072FF);
        padding: 8px 15px;
        border-radius: 20px;
        color: white;
        text-decoration: none;
    }
    
    /* Categories Section */
    .categories-section {
        background: rgba(30, 30, 46, 0.8);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 20px;
    }
    .category-button {
        background: rgba(45, 45, 61, 0.5);
        border: none;
        border-radius: 15px;
        padding: 10px 20px;
        margin: 0 10px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        animation: fadeIn 0.5s ease-out;
    }
    .category-button:hover {
        background: linear-gradient(45deg, #00C6FF, #0072FF);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 198, 255, 0.3);
    }
    
    /* Thread Cards */
    .thread-card {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
        transition: all 0.4s ease;
        cursor: pointer;
        backdrop-filter: blur(8px);
        animation: fadeIn 0.5s ease-out;
    }
    .thread-card:hover {
        transform: translateY(-5px) scale(1.01);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    }
    .thread-title {
        font-size: 18px;
        font-weight: 600;
        color: white;
        margin-bottom: 10px;
    }
    .thread-preview {
        color: #999;
        font-size: 14px;
        margin-bottom: 15px;
    }
    .thread-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        color: #666;
        font-size: 14px;
    }
    .upvote-button {
        display: inline-block;
        padding: 6px 12px;
        background: #2f54eb;
        color: white;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.2s ease, background 0.3s ease;
        animation: fadeIn 0.5s ease-out;
    }
    .upvote-button:hover {
        transform: scale(1.05);
        background: #40a9ff;
    }
    
    /* Create Thread Button */
    .create-thread-button {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
        animation: fadeIn 0.5s ease-out;
    }
    .floating-plus {
        position: absolute;
        font-size: 1.2rem;
        color: #2f54eb;
        animation: floatUp 1s ease forwards;
    }
    .comment-section {
        animation: fadeIn 0.5s ease-out;
    }
</style>
""", unsafe_allow_html=True)

# Login Page
if not st.session_state.current_user:
    # Hide Streamlit's default elements
    st.markdown("""
        <style>
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        .stApp > header {visibility: hidden;}
        .stApp {
            margin-top: -80px;
        }
        .brand-area {
            text-align: center;
            margin-bottom: 10px;
        }
        .brand-name {
            font-size: 42px;
            font-weight: 700;
            background: linear-gradient(45deg, #00C6FF, #0072FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0px;
            line-height: 1;
        }
        .tagline {
            font-size: 16px;
            color: #666;
            margin-top: 0px;
        }
        .stForm {
            margin-top: -20px;
        }
        .stTextInput > div > div > input {
            padding: 10px 15px;
        }
        </style>
    """, unsafe_allow_html=True)
    
    st.markdown("""
        <div style="display: flex; justify-content: center; align-items: center; min-height: 90vh; padding: 10px;">
            <div style="width: 100%; max-width: 850px; display: flex; gap: 20px; align-items: center;">
                <div class="login-container" style="flex: 1;">
                    <div class="brand-area">
                        <div class="brand-name">ForumHub</div>
                        <div class="tagline">Where Ideas Thread Together</div>
                    </div>
                    <div style="width: 100%; height: 180px; margin-top: -10px;">
                    """, unsafe_allow_html=True)
    
    if lottie_wave:
        st_lottie(lottie_wave, height=180, key="wave")
    
    st.markdown("""
                    </div>
                </div>
                <div class="login-card" style="flex: 1; margin-top: -20px;">
                    <div style="padding: 15px;">
    """, unsafe_allow_html=True)
    
    with st.form("login_form", clear_on_submit=True):
        username = st.text_input("Username", placeholder="Enter your username")
        password = st.text_input("Password", type="password", placeholder="Enter your password")
        cols = st.columns([3, 1])
        with cols[0]:
            remember_me = st.checkbox("Remember me")
        with cols[1]:
            st.markdown('<div class="forgot-password" style="margin-top: 3px;"><a href="#">Forgot?</a></div>', unsafe_allow_html=True)
        
        submitted = st.form_submit_button("Login", use_container_width=True)
        
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
                    st_lottie(lottie_login_success, height=80, key="login_success")
                st.balloons()
                time.sleep(1)
                st.rerun()
            else:
                st.error("Invalid credentials")
                st.markdown("""
                <script>
                    document.querySelector('.login-card').classList.add('shake');
                    setTimeout(() => {
                        document.querySelector('.login-card').classList.remove('shake');
                    }, 500);
                </script>
                """, unsafe_allow_html=True)
    
    st.markdown("""
                    </div>
                </div>
            </div>
        </div>
    """, unsafe_allow_html=True)

# Main App (After Login)
elif st.session_state.current_user:
    # Add particles background
    add_particles_background()
    
    # Add theme switcher
    theme_switcher()
    
    # Add modal component
    add_modal_component()
    
    # Top Navigation Bar
    search_col, profile_col = st.columns([3, 1])
    with search_col:
        search_query = st.text_input("🔍", placeholder="Search threads...", label_visibility="collapsed")
    with profile_col:
        if st.button(f"👤 @{st.session_state.current_user['username']}", type="primary"):
            st.session_state.show_profile = True

    # Categories Section
    st.markdown("### 📚 Categories")
    cat_cols = st.columns(4)
    for idx, category in enumerate(st.session_state.categories):
        with cat_cols[idx]:
            if st.button(f"{category['icon']} {category['name'].split()[-1]}", 
                        key=f"cat_{category['id']}", 
                        use_container_width=True):
                handle_category_selection(category['id'])

    # Display filtered or searched posts
    if search_query:
        filtered_posts = [post for post in st.session_state.posts 
                         if search_query.lower() in post['title'].lower() 
                         or search_query.lower() in post['content'].lower()]
        st.markdown("### 🔍 Search Results")
    elif 'selected_category' in st.session_state and st.session_state.selected_category:
        filtered_posts = [post for post in st.session_state.posts 
                         if post['category_id'] == st.session_state.selected_category]
        category_name = next(c['name'] for c in st.session_state.categories 
                           if c['id'] == st.session_state.selected_category)
        st.markdown(f"### {category_name}")
    else:
        st.markdown("### 🔥 Trending Threads")
        filtered_posts = sorted(st.session_state.posts, 
                              key=lambda x: (x['upvotes'] - x['downvotes']), 
                              reverse=True)

    # Display posts with enhanced UI
    for post in filtered_posts:
        with st.container():
            st.markdown(f"""
                <div class="thread-card">
                    <h3>{post['title']}</h3>
                    <p>{post['content'][:200]}...</p>
                    <div class="thread-meta">
                        <button class="upvote-button" onclick="handleUpvote(this)">🔼 {post['upvotes']} Upvotes</button>
                        <span>💬 {len(post['comments'])} Comments</span>
                        <span>👤 {post['author']}</span>
                        <span>🕒 {post['timestamp']}</span>
                    </div>
                </div>
            """, unsafe_allow_html=True)
            
            col1, col2 = st.columns([1, 1])
            with col1:
                if st.button("👍 Upvote", key=f"up_{post['id']}"):
                    handle_upvote(post['id'])
                    trigger_confetti()
                    st.rerun()
            with col2:
                if st.button("💬 Comment", key=f"comment_{post['id']}"):
                    st.session_state.commenting_on = post['id']

            # Show comments with enhanced UI
            if len(post['comments']) > 0:
                with st.expander(f"Show {len(post['comments'])} comments"):
                    for comment in post['comments']:
                        st.markdown(f"""
                            <div style="padding: 10px; margin: 5px 0; background: rgba(255, 255, 255, 0.8); border-radius: 10px; backdrop-filter: blur(8px);">
                                <strong>{comment['author']}</strong>: {comment['content']}
                            </div>
                        """, unsafe_allow_html=True)

    # Create New Post Button with Lottie animation
    components.html("""
        <div style="position: fixed; bottom: 30px; right: 30px; z-index: 1000;">
            <lottie-player src="https://assets3.lottiefiles.com/packages/lf20_tll0j4bb.json" 
                          background="transparent" speed="1" 
                          style="width: 60px; height: 60px; cursor: pointer;" 
                          onclick="openModal()" 
                          loop autoplay></lottie-player>
        </div>
        <script>
            document.addEventListener('create_thread', function(e) {
                // Handle the thread creation event
                const { title, content } = e.detail;
                // You can add additional handling here if needed
            });
        </script>
    """, height=0)

# Add modal component
def add_modal_component():
    components.html("""
        <div id="newThreadModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h3>📝 Create a New Thread</h3>
                <input id="threadTitle" type="text" placeholder="Thread Title" style="width:100%; padding:10px; margin:10px 0;" />
                <textarea id="threadContent" placeholder="Your content here..." style="width:100%; height:100px; padding:10px;"></textarea>
                <button onclick="postThread()" style="margin-top:10px; padding:10px 20px; background:#2f54eb; color:white; border:none; border-radius:8px; cursor:pointer;">Post</button>
            </div>
        </div>
        <script>
            function openModal() {
                document.getElementById("newThreadModal").style.display = "block";
            }
            function closeModal() {
                document.getElementById("newThreadModal").style.display = "none";
            }
            function postThread() {
                const title = document.getElementById("threadTitle").value;
                const content = document.getElementById("threadContent").value;
                if (title && content) {
                    // Trigger Streamlit to create new post
                    const event = new CustomEvent('create_thread', { 
                        detail: { title, content }
                    });
                    document.dispatchEvent(event);
                    closeModal();
                }
            }
            // Close modal when clicking outside
            window.onclick = function(event) {
                const modal = document.getElementById("newThreadModal");
                if (event.target == modal) {
                    closeModal();
                }
            }
        </script>
        <style>
            .modal {
                display: none;
                position: fixed;
                z-index: 1001;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background-color: #1E1E2E;
                margin: 10% auto;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                width: 80%;
                max-width: 500px;
                animation: slideIn 0.3s ease;
            }
            .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }
            .close:hover {
                color: #fff;
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            #threadTitle, #threadContent {
                background: rgba(45, 45, 61, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                color: white;
                font-family: 'Poppins', sans-serif;
            }
            #threadTitle:focus, #threadContent:focus {
                outline: none;
                border-color: #2f54eb;
                box-shadow: 0 0 10px rgba(47, 84, 235, 0.3);
            }
            button {
                transition: all 0.3s ease;
            }
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(47, 84, 235, 0.3);
            }
        </style>
    """, height=0) 
