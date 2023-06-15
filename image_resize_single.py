import cv2
import sys
import math

ROOT_PATH = sys.argv[1]
NEW_PATH = sys.argv[2]

img = cv2.imread(ROOT_PATH)

try:
    height, width, c = img.shape    

    if (width > height):
        new_dim = (math.floor(width*256/height), 256)
    else:
        new_dim = (256, math.floor(height*256/width))
        
    resized_img = cv2.resize(img, new_dim)
        
    cv2.imwrite(NEW_PATH, resized_img)
except:
    pass
#    cv2.imshow('Img', resized_img)
#    cv2.waitKey(0)
