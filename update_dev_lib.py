# SpeechUp 2018
# This file updates all the dev lib folders
import os
import shutil
os.chdir('./functions')

devDirs = [] # array of the directories in functions

print "Starting production function update"

# This creates an array of all the folder names within the directory 'functions' that begin with "dev"
for dirName in os.listdir('.'):
    if dirName.startswith('dev'):
        devDirs.append(dirName)

# updates lib folders
for dir in devDirs:
    shutil.rmtree(dir + "/lib") # removes the old lib folders
    shutil.copytree('../lib_dev', dir + "/lib") # copies the dev_lib folder and puts it in each dev function directory


print "Completed production function update"
