import cv2
import sys
import os
import math
from tqdm import tqdm

ROOT_PATH = sys.argv[1]
NEW_PATH = sys.argv[2]
SIZE = 512

file_names = os.listdir(ROOT_PATH)
file_names = [os.path.join(ROOT_PATH, f) for f in file_names]

for f in tqdm(file_names):
    img = cv2.imread(f)
    
    try:
        height, width, c = img.shape    
    
        if (width > height):
            new_dim = (math.floor(width*SIZE/height), SIZE)
        else:
            new_dim = (SIZE, math.floor(height*SIZE/width))
            
        resized_img = cv2.resize(img, new_dim)
            
        cv2.imwrite(f.replace(ROOT_PATH, NEW_PATH), resized_img)
    except:
        pass
#    cv2.imshow('Img', resized_img)
#    cv2.waitKey(0)
