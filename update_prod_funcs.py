# SpeechUp 2018
# This file updates all the dev folders to prod folders
import os
import shutil
os.chdir('./functions')

dirList = [] # array of the directories in functions
dirSplitList = [] # initialize 2D array to hold directory names split by '_'

print "Starting production function update"

# This creates an array of all the folder names within the directory 'functions'
for dirName in os.listdir('.'):
    dirList.append(dirName)

# Creates the 2D array of split directory names
for dir in dirList:
    dirSplit = dir.split("_") # create new array split by '_' in directory name
    dirSplitList.append(dirSplit) # appends dirsplitList array

# This iterates through the dirList array and deletes the 'prod' folders
counter = 0 # this counter relates the array to the actual directories
for dir in dirSplitList:
    if dir[0] == "prod": # checks to see if the first element in an array matches "prod"
        shutil.rmtree(dirList[counter]) # if it matches, the corresponding folder is deleted
    counter += 1 

# for each directory in dirList, creates new prod copy
for dir in dirList:
    firstThreeChar = dir[:3]
    # This is data validation to makes sure that it is only handling folders that start with 'dev'
    if firstThreeChar != "dev":
        continue
    shortWord = dir[3:] # takes out the prefix of 'dev'
    shutil.copytree('./' + dir, './prod' + shortWord) # copies the dev folder and names it 'prod'
    dirList.append("prod" + shortWord) # adds the new prod folder to the dirList array
    shutil.rmtree("prod" + shortWord + "/lib") # removes the old lib folder
    shutil.copytree('../lib_prod', "./prod" + shortWord + "/lib") # creates the new prod lib folder

print "Completed production function update"