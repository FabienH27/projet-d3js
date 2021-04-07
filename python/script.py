import json

funnel_list = []

with open('data/funnel_data.json') as json_file:
    data = json.load(json_file)
    for f in data:
        sublist = []
        sublist.append(f)
        datalist = []
        for line in data[f]:
            datalist.append(line)
        sublist.append(datalist)
        funnel_list.append(sublist)