import cv2
import sys
import os
import math
from tqdm import tqdm

ROOT_PATH = sys.argv[1]
NEW_PATH = sys.argv[2]

file_names = os.listdir(ROOT_PATH)
file_names = [os.path.join(ROOT_PATH, f) for f in file_names]

for f in tqdm(file_names):
    img = cv2.imread(f)
    
    try:
        height, width, c = img.shape    
    
        if (width > height):
            new_dim = (math.floor(width*256/height), 256)
        else:
            new_dim = (256, math.floor(height*256/width))
            
        resized_img = cv2.resize(img, new_dim)
            
        cv2.imwrite(f.replace(ROOT_PATH, NEW_PATH), resized_img)
    except:
        pass
#    cv2.imshow('Img', resized_img)
#    cv2.waitKey(0)
