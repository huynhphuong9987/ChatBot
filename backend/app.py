from flask import Flask, jsonify, request
from flask_cors import CORS
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain_core.prompts.prompt import PromptTemplate
from langchain.chains.question_answering import load_qa_chain
from langchain_text_splitters import RecursiveCharacterTextSplitter

import os
import json
from dotenv import load_dotenv
load_dotenv()


####################### Getting API keys ######################## 

groqAPI = os.getenv("GROQ_API_KEY")
pineconeAPI = os.getenv("PINECONE_API_KEY")


####################### Create Flask app ######################## 
app = Flask(__name__,static_url_path=None)
app.config.from_object(__name__)
# cors = CORS(app, origins= "http://localhost:5173", supports_credentials=True)
cors = CORS(app, origins= "https://chatbot-app-eox5.onrender.com", supports_credentials=True)
app.app_context()


#######################  Create a chatgroq client ####################### 
chat_model = ChatGroq(
    temperature=0.4,
    model="llama3-70b-8192",
    # model='llama-3.1-405b-reasoning',
    api_key=groqAPI,
    max_tokens=1000,
)

memory = ConversationBufferMemory()

template =  """
The following is a friendly conversation between a human and an AI assistance. 
Firstly, the human will provide what type of assistant he needs. 
You are a helpful assistant specialized in that type of assistant. You should first introduce in a very short sentence of who you are.

The conversation history is as follows:
    {history}
    The user just said: {input}
    Your response should only provide information related to your domain knowledge
    If the question is outside the topic of knowledge, it will politely indicate that you can only help withknowledge.
"""

PROMPT = PromptTemplate(input_variables=["history","input", "topic"], template=template)
# chain = prompt | chat_model
chain = ConversationChain(
    prompt=PROMPT,
    llm=chat_model,
    verbose=True,
    memory=memory,
)


##################### For testing #####################
@app.route('/',methods = ["GET"])
def hello_world():
    return jsonify("hello")


##################### Find an assistance ##################
@app.route("/fetch_assistance", methods=["POST", "GET"])
def fetch_assistant():
    input = request.get_json()
    topic = input["fectchAssistance"]
    answer = chain.predict(input = f"{topic}")
    return jsonify({'introduction':answer, "topic": topic})

 
##################### Start chatting ######################
@app.route('/chat', methods=["POST", "GET"])
def chat_window():
    input = request.get_json()
    message = input["newMessage"]
    chain.predict(input = f"{message}")
    return jsonify(memory.load_memory_variables({}))

@app.route('/get_chat_history', methods=["GET"])
def get_chat_history():
    json_data = memory.load_memory_variables({})
    return json_data

####################### Start a new chat #########################
@app.route('/newChat', methods=["GET"])
def newChat():
    memory.clear()
    return jsonify("New Chat")


if __name__ == '__main__':
    app.run(host = '0.0.0.0', port=8000)
    # app.run(host = 'localhost', port=8000)