
from calendar import day_abbr, month
from crypt import methods
import os
import time
import json

from cs50 import SQL

from livereload import Server

from flask import Flask, flash, helpers, redirect, render_template, request, session
from flask_session import Session
import sqlite3
from sqlalchemy.sql.base import Executable
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash

# Flask shit
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.after_request
def after_request(response):

    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"

    return response


# DB
db = SQL("sqlite:///hrs.db")


# json sql injection


def add_data_db(year, month, day, room, adults, children, daily_rate, breakfast, room_total, day_total):

    # look up

    # create anew
    injection = ('insert into reports (year, month, day, room, adults, children, daily_rate, breakfast, room_total, day_total) values (%d, %d, %d, %d, %d, %d, %f, %d, %f, %f);' % (
        year, month, day, room, adults, children, daily_rate, breakfast, room_total, day_total))
    db.execute(injection)
    print('inserted')


@app.route('/', methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        print('INDEX POST --------------------')
        data_k = ('' + request.form.get('day') + ' ' +
                  request.form.get('month') + ' ' + request.form.get('year'))
        print(data_k)

        rep_day = request.form.get('day')

        rep_month = request.form.get('month')

        rep_year = request.form.get('year')

        data = db.execute(
            'select * from reports where year = ? and month = ? and day = ?;', rep_year, rep_month, rep_day)
        if len(data) == 0:
            data = [
                {'day': '0',
                 'month': '0',
                 'year': '0',
                 'room': 'No data',
                 'adults': 'No data',
                 'children': 'No data',
                 'room_total': 'No data'
                 }
            ]

        return render_template('index.html', data=data)
    else:
        data = 'none'
        return render_template('index.html', data=data)


@ app.route("/add-data", methods=["GET", "POST"])
def add_data():
    if request.method == 'POST':
        print('/data-posted-----------')
        data = request.json
        listofdata = data['report']
        year = int(listofdata[0]['year'])
        month = int(listofdata[0]['month'])
        day = int(listofdata[0]['date'])
        db.execute(
            'delete from reports where year = ? and month = ? and day = ?', year, month, day)
        print('----DELETED----')

        for object in listofdata:

            room = int(object['room-id'])
            adults = int(object['adult-guests'])
            children = int(object['child-guests'])
            daily_rate = float(object['daily-rate'])
            breakfast = int(object['breakfast'])
            room_day_total = float(object['room-total'])
            hotel_day_total = float(object['day-total'])
            year = int(object['year'])
            month = int(object['month'])
            day = int(object['date'])

            add_data_db(year, month, day, room, adults, children,
                        daily_rate, breakfast, room_day_total, hotel_day_total)

        return render_template('add.html')
    else:
        return render_template('add.html')


if __name__ == "__main__":
    app.run(host="172.16.200.10", port=5050, debug=True)

    # app.run(host="192.168.0.166", port=5500, debug=True)
