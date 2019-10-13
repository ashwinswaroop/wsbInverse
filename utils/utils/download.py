import requests
import time
import sys
import pathlib
import datetime
import json
import calendar

first = True
pattern = '%Y.%m.%d %H:%M:%S'
f=open("wsb2.json", "at")
f.write("[")
for x in range(0,2):
    limit = calendar.monthrange(2019,x+1)[1]
    for y in range(0,limit):
        date_time = "2019."+"{0:0=2d}".format(x+1)+"."+"{0:0=2d}".format(y+1)+" 00:00:00"
        after = int(time.mktime(time.strptime(date_time, pattern)))
        before = after+3600
        for z in range(0,24):
            r = requests.get("https://api.pushshift.io/reddit/search/comment/?q=&subreddit=wallstreetbets&after="+str(after)+"&before="+str(before)+"&size=1000")
            j = json.loads(r.content)
            for i in j['data']:
                if first == True:
                    f.write(json.dumps(i))
                    first = False
                else:
                    f.write(","+json.dumps(i))
            after = before;
            before = after+3600
        print("finished day"+str(y+1))
    print("finished month"+str(x+1))
f.write("]")
