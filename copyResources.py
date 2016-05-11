import os 
import os.path 
import shutil 
import time,  datetime

srcDir = "Debug.win32"
srDir = "D:\SoCrezy\client\cocos2d-x-2.2.3\projects\DaShiSha\Resources"
destDir = "D:\Design\GAME"
def copyFiles(sourceDir,  targetDir): 
    if sourceDir.find(".svn") > 0: 
        return
    if sourceDir.find(".obj") > 0: 
        return
    for file in os.listdir(sourceDir): 
        sourceFile = os.path.join(sourceDir,  file) 
        targetFile = os.path.join(targetDir,  file) 
        if os.path.isfile(sourceFile): 
            if not os.path.exists(targetDir):  
                os.makedirs(targetDir)  
            if not os.path.exists(targetFile) or(os.path.exists(targetFile) and (os.path.getsize(targetFile) != os.path.getsize(sourceFile))):  
                    open(targetFile, "wb").write(open(sourceFile, "rb").read()) 
        if os.path.isdir(sourceFile): 
            First_Directory = False 
            copyFiles(sourceFile, targetFile)
			
def removeFileInFirstDir(targetDir): 
     for file in os.listdir(targetDir): 
         targetFile = os.path.join(targetDir,  file) 
         if os.path.isfile(targetFile): 
             os.remove(targetFile)
			 
def coverFiles(sourceDir,  targetDir): 
        for file in os.listdir(sourceDir): 
            sourceFile = os.path.join(sourceDir,  file) 
            targetFile = os.path.join(targetDir,  file) 
            #cover the files 
            if os.path.isfile(sourceFile): 
                open(targetFile, "wb").write(open(sourceFile, "rb").read())
				
def moveFileto(sourceDir,  targetDir): 
    shutil.copy(sourceDir,  targetDir)


def writeVersionInfo(targetDir): 
   open(targetDir, "wb").write("Revison:")	

   
if  __name__ =="__main__": 
  copyFiles(srcDir, destDir)
  copyFiles(srDir,destDir)

