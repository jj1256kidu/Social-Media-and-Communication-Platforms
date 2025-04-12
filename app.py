import streamlit as st
import time
from datetime import datetime
import base64
from PIL import Image
import io
import random

# Custom CSS for beautiful UI
st.markdown("""
    <style>
    .main {
        background-color: #f5f5f5;
    }
    .stApp {
        max-width: 1200px;
        margin: 0 auto;
    }
    .chat-message {
        padding: 1rem;
        border-radius: 1rem;
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .chat-message.user {
        background-color: #2b313e;
        color: white;
        margin-left: 20%;
    }
    .chat-message.bot {
        background-color: #f0f2f6;
        margin-right: 20%;
    }
    .stButton>button {
        border-radius: 50%;
        height: 3em;
        width: 3em;
        background-color: #4CAF50;
        color: white;
    }
    .stTextInput>div>div>input {
        border-radius: 20px;
    }
    </style>
""", unsafe_allow_html=True)

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'groups' not in st.session_state:
    st.session_state.groups = ['General', 'Work', 'Friends']
if 'current_group' not in st.session_state:
    st.session_state.current_group = 'General'
if 'username' not in st.session_state:
    st.session_state.username = None

# Mock user data
mock_users = {
    'Alice': '👩‍💼',
    'Bob': '👨‍💼',
    'Charlie': '👨‍🔬',
    'David': '👨‍🎨',
    'Eve': '👩‍🎤'
}

# Mock messages for each group
mock_messages = {
    'General': [
        {'sender': 'Alice', 'text': 'Hello everyone! 👋', 'time': '10:00 AM'},
        {'sender': 'Bob', 'text': 'Hi Alice! How are you?', 'time': '10:01 AM'},
        {'sender': 'Charlie', 'text': 'Good morning! 🌞', 'time': '10:02 AM'}
    ],
    'Work': [
        {'sender': 'David', 'text': 'Meeting at 3 PM today', 'time': '09:30 AM'},
        {'sender': 'Eve', 'text': 'I\'ll prepare the presentation', 'time': '09:35 AM'}
    ],
    'Friends': [
        {'sender': 'Alice', 'text': 'Who\'s up for lunch? 🍔', 'time': '11:00 AM'},
        {'sender': 'Bob', 'text': 'Count me in!', 'time': '11:01 AM'}
    ]
}

# Login page
if not st.session_state.username:
    st.title("💬 Minimal Messenger")
    st.write("---")
    
    username = st.text_input("Enter your username")
    if username:
        st.session_state.username = username
        st.experimental_rerun()

else:
    # Sidebar
    with st.sidebar:
        st.title(f"Welcome, {st.session_state.username}!")
        st.write("---")
        
        # Group selection
        st.subheader("Groups")
        for group in st.session_state.groups:
            if st.button(group, key=f"group_{group}"):
                st.session_state.current_group = group
                st.experimental_rerun()
        
        # New group creation
        new_group = st.text_input("Create new group")
        if new_group and new_group not in st.session_state.groups:
            st.session_state.groups.append(new_group)
            st.session_state.current_group = new_group
            st.experimental_rerun()
        
        # Logout button
        if st.button("Logout"):
            st.session_state.username = None
            st.experimental_rerun()

    # Main chat area
    st.title(f"#{st.session_state.current_group}")
    
    # Display group members
    members = list(mock_users.keys())
    st.write(f"👥 Members: {', '.join(members)}")
    st.write("---")
    
    # Display messages
    for msg in mock_messages.get(st.session_state.current_group, []):
        with st.container():
            col1, col2 = st.columns([1, 4])
            with col1:
                st.write(f"{mock_users[msg['sender']]} {msg['sender']}")
            with col2:
                st.markdown(f"""
                    <div class="chat-message {'user' if msg['sender'] == st.session_state.username else 'bot'}">
                        <div>{msg['text']}</div>
                        <div style="font-size: 0.8em; opacity: 0.7;">{msg['time']}</div>
                    </div>
                """, unsafe_allow_html=True)
    
    # Message input
    st.write("---")
    col1, col2 = st.columns([4, 1])
    
    with col1:
        message = st.text_input("Type your message...", key="input")
    
    with col2:
        uploaded_file = st.file_uploader("📎", type=['png', 'jpg', 'jpeg', 'gif'])
    
    # Send message
    if message or uploaded_file:
        if message:
            # Add text message
            new_message = {
                'sender': st.session_state.username,
                'text': message,
                'time': datetime.now().strftime("%I:%M %p")
            }
            if st.session_state.current_group not in mock_messages:
                mock_messages[st.session_state.current_group] = []
            mock_messages[st.session_state.current_group].append(new_message)
        
        if uploaded_file:
            # Display uploaded image
            image = Image.open(uploaded_file)
            st.image(image, caption='Uploaded Image', use_column_width=True)
            
            # Add image message
            new_message = {
                'sender': st.session_state.username,
                'text': f"![Image](data:image/png;base64,{base64.b64encode(uploaded_file.getvalue()).decode()})",
                'time': datetime.now().strftime("%I:%M %p")
            }
            if st.session_state.current_group not in mock_messages:
                mock_messages[st.session_state.current_group] = []
            mock_messages[st.session_state.current_group].append(new_message)
        
        st.experimental_rerun() 
