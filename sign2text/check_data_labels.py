import pickle
import numpy as np

with open('data.pickle', 'rb') as f:
    data_dict = pickle.load(f)

labels = np.asarray(data_dict['labels'])
labels_int = labels.astype(int)   # convert '0','1',... to integers
unique = np.unique(labels_int)

print("Unique label indices:", unique)
print("Min label:", int(unique.min()), "Max label:", int(unique.max()))
