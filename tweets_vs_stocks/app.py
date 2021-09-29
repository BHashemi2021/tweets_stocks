# Twitter app example

# importing the needed libraries
from flask import Flask, render_template, request, redirect, make_response
from flask import jsonify
import pandas as pd
from new_NLTK_clean_and_classify import tweet_list, cleaned_df, classify_pickle, clean_tweet_tokens
from nrc_mashup import full_list
import os
import subprocess
import json
from sqlalchemy import create_engine



myDict = {} 

''' 
FOR HEROKU - UNCOMMENT
'''
subprocess.call("bin/run_cloud_sql_proxy")


-----------------
from sqlalchemy import create_engine
engine = create_engine("sqlite:///my_data.db")
df.to_sql("table_name",conn=engine)

-------------------

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db.sqlite"
DB = os.environ.get("DBS_URL")
engine=create_engine(DB)

engine = create_engine("postgresql://benjh:postgress@localhost:41321/postgres")

app = Flask(__name__)


# Web Page
@app.route("/")
@app.route("/main")
def home():
	return render_template('index.html', title='tweets_vs_stocks')


# Old DB Stream
@app.route("/tweets")
def tweets():
    data = pd.read_sql("select * from tweets", con=engine).to_json(index=False,orient="table")
    tweets = json.loads(data)
    return tweets

# New DB Backfilled with 7 days
@app.route("/new_tweets")
def new_tweets():
    data = pd.read_sql("select * from new_tweets", con=engine)
    return data.to_json()

@app.route("/cleaned_tweets")
def get_cleaned():
    clean_list = []
    for i,row in cleaned_df.iterrows():
        clean_list.append({"Tokenized":cleaned_df['Tokens'].iloc[i],"Sentiment":cleaned_df['Emotions'].iloc[i]})
    return jsonify(clean_list)

# End Point for Word Cloud Vis
@app.route("/word_cloud")
def get_words():
    my_list = []
    cloud = pd.read_sql("select * from word_cloud",con=engine)
    for i,row in cloud.iterrows():
        my_list.append({'x':cloud['word'].iloc[i],'value':int(cloud['value'].iloc[i]), 'category':cloud['category'].iloc[i]})
    return jsonify(my_list)


if __name__ == "__main__":
    app.run(debug=True)