import streamlit as st
from streamlit_chat import message
import os
from PIL import Image
import io
import base64
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="Minimal Messenger",
    page_icon="💬",
    layout="wide"
)

# Custom CSS for minimalist design
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
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
    }
    .chat-message.user {
        background-color: #2b313e;
        color: white;
    }
    .chat-message.bot {
        background-color: #f0f2f6;
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

# Sidebar for group selection
with st.sidebar:
    st.title("💬 Minimal Messenger")
    st.write("---")
    
    # Group selection
    st.subheader("Groups")
    for group in st.session_state.groups:
        if st.button(group, key=f"group_{group}"):
            st.session_state.current_group = group
    
    # New group creation
    new_group = st.text_input("Create new group")
    if new_group and new_group not in st.session_state.groups:
        st.session_state.groups.append(new_group)
        st.session_state.current_group = new_group
        st.experimental_rerun()

# Main chat area
st.title(f"#{st.session_state.current_group}")

# Display messages
for msg in st.session_state.messages:
    if msg['group'] == st.session_state.current_group:
        message(
            msg['content'],
            is_user=msg['is_user'],
            key=msg['key'],
            avatar_style="adventurer" if msg['is_user'] else "bottts"
        )

# Message input and media upload
col1, col2 = st.columns([4, 1])
with col1:
    user_input = st.text_input("Type your message...", key="input")
with col2:
    uploaded_file = st.file_uploader("📎", type=['png', 'jpg', 'jpeg', 'gif'])

# Send message
if user_input or uploaded_file:
    if user_input:
        # Add text message
        st.session_state.messages.append({
            'content': user_input,
            'is_user': True,
            'group': st.session_state.current_group,
            'key': f"user_{len(st.session_state.messages)}"
        })
    
    if uploaded_file:
        # Display uploaded image
        image = Image.open(uploaded_file)
        st.image(image, caption='Uploaded Image', use_column_width=True)
        
        # Add image message
        st.session_state.messages.append({
            'content': f"![Image](data:image/png;base64,{base64.b64encode(uploaded_file.getvalue()).decode()})",
            'is_user': True,
            'group': st.session_state.current_group,
            'key': f"image_{len(st.session_state.messages)}"
        })
    
    st.experimental_rerun() 
