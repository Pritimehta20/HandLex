import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report
from sklearn.utils.class_weight import compute_class_weight

# Load feature dataset
data_dict = pickle.load(open('./data.pickle', 'rb'))
X = np.asarray(data_dict['data'], dtype=np.float32)   # (N, 126)
y = np.asarray(data_dict['labels'])

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Compute class weights to handle imbalance
classes = np.unique(y_train)
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=classes,
    y=y_train
)
class_weight_dict = {cls: w for cls, w in zip(classes, class_weights)}

base_rf = RandomForestClassifier(
    n_jobs=-1,
    random_state=42,
    class_weight=class_weight_dict
)

param_grid = {
    'n_estimators': [200, 400],
    'max_depth': [None, 25, 40],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2]
}

grid = GridSearchCV(
    base_rf,
    param_grid,
    cv=3,
    n_jobs=-1,
    scoring='accuracy',
    verbose=1
)

grid.fit(X_train, y_train)

print("Best params:", grid.best_params_)
best_model = grid.best_estimator_

y_pred = best_model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Accuracy: {acc * 100:.2f}%")
print(classification_report(y_test, y_pred))

with open('model.p', 'wb') as f:
    pickle.dump({'model': best_model}, f)

print("Saved tuned model to model.p")
