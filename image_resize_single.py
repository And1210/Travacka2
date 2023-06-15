import cv2
import sys
import math

ROOT_PATH = sys.argv[1]

img = cv2.imread(ROOT_PATH)

DIMS = [256, 512]

for d in DIMS:
    try:
        height, width, c = img.shape    
    
        if (width > height):
            new_dim = (math.floor(width*d/height), d)
        else:
            new_dim = (d, math.floor(height*d/width))
            
        resized_img = cv2.resize(img, new_dim)
            
        cv2.imwrite(ROOT_PATH.replace('uploads/', 'uploads-{}/'.format(d)), resized_img)
    except:
        pass
#    cv2.imshow('Img', resized_img)
#    cv2.waitKey(0)
