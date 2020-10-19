from django.shortcuts import render
from django.shortcuts import render, HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from collections import defaultdict
import json
import os
from .astar import search

import math
import numpy as np
from keras.models import model_from_json
import random

dim = 50
json_file = open(os.path.abspath('getPath/model.json'), 'r')
loaded_model_json = json_file.read()
json_file.close()
model = model_from_json(loaded_model_json)
model.load_weights(os.path.abspath('getPath/model.h5'))

@api_view(['GET'])
def generate_random_maze(request):
    maze = [[1 for i in range(dim)] for i in range(dim)]
    for i in range(dim):
        for j in range(dim):
            r = random.random()
            if r>0.8:
                maze[i][j] = -1
    data = {"maze": maze}
    return Response(data)


@api_view(['POST'])
#@permission_classes([AllowAny])
def generate_random_start_end(request):
    print("start end API called")
    start = [0, 0] # starting position
    end = [4,5] # ending position
    #print("post ", request.data)
    maze = json.loads(request.data.get("maze"))
    while True:
        start = [random.randint(0,dim-1),random.randint(0,dim-1)]
        end = [random.randint(0,dim-1),random.randint(0,dim-1)]
        if maze[start[0]][start[1]]==1 and maze[end[0]][end[1]]==1:
            path = search(maze, 1, start, end)
            if path!=None:
                break
    data = {
        "start": start,
        "end": end
    }
    return Response(data)

def getImmediate(maze,x,y,n):
    up,down,left,right = -1,-1,-1,-1
    if x>=0 and x<n and y>=0 and y<n and maze[x][y]==1:
        if x-1>=0 and y>=0 and y<n:
            up = maze[x-1][y]
        if y-1>=0 and x>=0 and x<n:
            left = maze[x][y-1]
        if x+1<n and y>=0 and y<n:
            down = maze[x+1][y]
        if y+1<n and x>=0 and x<n:
            right = maze[x][y+1]
    return up,down,left,right

def getModelInput(maze,current,end,moveList):
    x,y = tuple(current)
    up,down,left,right = getImmediate(maze,x,y,dim)
    curr = np.array(current)
    e = np.array(end)
    diff = curr-e
    dist = math.sqrt(np.sum(np.multiply(diff,diff)))
    cosTheta = (e[0]-curr[0])/dist
    moveSlice = moveList[len(moveList)-11:len(moveList)-1]
    inp = [up, sum(list(getImmediate(maze,x-1,y,dim)))-1,
            down, sum(list(getImmediate(maze,x+1,y,dim)))-1,
            left, sum(list(getImmediate(maze,x,y-1,dim)))-1,
            right, sum(list(getImmediate(maze,x,y+1,dim)))-1,
            x, y, end[0], end[1],dist,cosTheta] + moveSlice
    inp = np.reshape(inp,(1,1,24))
    return inp

def isMovePossible(maze,temp):
    return maze[temp[0]][temp[1]]!=-1

def isIndexValid(temp):
    return temp[0]>=0 and temp[0]<dim and temp[1]>=0 and temp[1]<dim

def getRandomMove(maze, current,d,lastMove):
    l = list()
    vals = list()
    for k in d.keys():
        temp = current + d[k]
        if isIndexValid(temp) and isMovePossible(maze,temp):
            l.append(k)
            vals.append(maze[temp[0]][temp[1]])
    flag = 0
    for i in range(len(l)):
        if abs(l[i]-lastMove)==2:
            flag = 1
            x = i
    if flag==1 and len(l)>1:
        del l[x]
        del vals[x]
    for i in range(len(vals)):
        vals[i] = 1/vals[i]
    s = sum(vals)
    probs = [x/s for x in vals]
    idx = np.random.choice(len(l), p=probs)
    return l[idx]

def list_duplicates(seq):
    tally = defaultdict(list)
    for i,item in enumerate(seq):
        tally[str(item)].append(i)
    return ((key,locs) for key,locs in tally.items() 
                            if len(locs)>1)

def GetDuplicates(moves):
    return sorted(list(list_duplicates(moves)))

def RemoveLoops(moves):
    #print("initial len ", len(moves))
    while True:
        dups = GetDuplicates(moves)
        if len(dups)==0:
            break
        m = 0
        s,e = 0,0
        for d in dups:
            rep = d[1]
            val = rep[-1]-rep[0]
            if val>m:
                m = val
                s = rep[0]
                e = rep[-1]
        moves = moves[:s] + moves[e:]
        #print("len moves ",len(moves))
    return moves

@api_view(['POST'])
def getMaze_And_Path(request):
    print("Main API called")
    # 1.
    maze = json.loads(request.data.get("maze"))
    maze_copy = np.copy(maze)

    # 2.
    start = json.loads(request.data.get("start"))
    end = json.loads(request.data.get("end"))

    d = {0:[-1,0],1:[0,1],2:[1,0],3:[0,-1]}
    moveList = [-1]*11
    moves = list()
    r = 0
    s = set()

    current = np.array(start)
    s.add(tuple(current))
    moves.append(list(current))
    st = np.array(start)
    e = np.array(end)
    diff = st-e
    initDist = math.sqrt(np.sum(np.multiply(diff,diff)))
    while current[0]!=end[0] or current[1]!=end[1]:
        if r==0:
            inp = getModelInput(maze,current,end,moveList)
            out = model.predict(inp)
            pred = np.argmax(out)
            temp = current + d[pred]
            if isIndexValid(temp) and isMovePossible(maze,temp):
                current += d[pred]
            else:
                r = 3
                pred = getRandomMove(maze,current,d,moveList[-1])
                r-=1
                current += d[pred]
            if tuple(current) in s:
                r = 2
            val = (inp[0][0][12]-initDist)/initDist
            if val>0.05:
                moveList = [-1]*11
        else:
            pred = getRandomMove(maze,current,d,moveList[-1])
            r-=1
            current += d[pred]
        s.add(tuple(current))
        moves.append(list(current))
        moveList.append(pred)

    finalMoves = RemoveLoops(moves)
    data = {
        "start": start,
        "end": end,
        "moves": finalMoves
    }
    #return render(request, 'base.html', context)
    #response = HttpResponse(context, content_type="application/json")
    return Response(data)
