==================================================
Training Logistic Regression...
==================================================

LR Train: 99.87%
LR Test:  93.97%

LR Per-class report:
                                precision    recall  f1-score   support

               acne-blackheads       0.95      0.94      0.94       180
                     acne-cyst       0.89      0.91      0.90       121
                   acne-fungal       0.94      0.99      0.97       121
                  acne-nodules       0.97      0.97      0.97       151
                  acne-papules       0.91      0.91      0.91       180
                 acne-pustules       0.93      0.92      0.93       180
               acne-whiteheads       0.92      1.00      0.96       180
                        eczema       0.97      0.92      0.94       180
                enlarged-pores       0.99      0.99      0.99       180
                       melasma       0.99      0.97      0.98       180
                         milia       0.93      0.94      0.94       180
                  out-of-scope       0.86      0.89      0.87       120
    post-inflammatory-erythema       0.85      0.83      0.84       180
post-inflammatory-pigmentation       0.96      0.96      0.96       180
                     psoriasis       0.99      0.97      0.98       158

                      accuracy                           0.94      2471
                     macro avg       0.94      0.94      0.94      2471
                  weighted avg       0.94      0.94      0.94      2471

✅ LR saved: ../trained_data/lr_classifier.pkl

==================================================
Training Random Forest...
==================================================

RF Train: 99.87%
RF Test:  86.93%

RF Per-class report:
                                precision    recall  f1-score   support

               acne-blackheads       0.87      0.85      0.86       180
                     acne-cyst       0.83      0.75      0.79       121
                   acne-fungal       0.91      0.98      0.94       121
                  acne-nodules       0.93      0.91      0.92       151
                  acne-papules       0.85      0.81      0.83       180
                 acne-pustules       0.84      0.82      0.83       180
               acne-whiteheads       0.87      0.94      0.91       180
                        eczema       0.83      0.84      0.83       180
                enlarged-pores       0.95      0.96      0.95       180
                       melasma       0.93      0.96      0.95       180
                         milia       0.87      0.85      0.86       180
                  out-of-scope       0.86      0.79      0.82       120
    post-inflammatory-erythema       0.70      0.74      0.72       180
post-inflammatory-pigmentation       0.85      0.88      0.87       180
                     psoriasis       0.96      0.95      0.95       158

                      accuracy                           0.87      2471
                     macro avg       0.87      0.87      0.87      2471
                  weighted avg       0.87      0.87      0.87      2471

✅ RF saved: ../trained_data/rf_classifier.pkl

==================================================
Training MLP...
==================================================
2026-03-21 22:37:47.498768: I tensorflow/core/util/port.cc:153] oneDNN custom operations are on. You may see slightly different numerical results due to floating-point round-off errors from different computation orders. To turn them off, set the environment variable `TF_ENABLE_ONEDNN_OPTS=0`.
2026-03-21 22:37:51.696183: I tensorflow/core/util/port.cc:153] oneDNN custom operations are on. You may see slightly different numerical results due to floating-point round-off errors from different computation orders. To turn them off, set the environment variable `TF_ENABLE_ONEDNN_OPTS=0`.
2026-03-21 22:37:53.643226: I tensorflow/core/platform/cpu_feature_guard.cc:210] This TensorFlow binary is optimized to use available CPU instructions in performance-critical operations.      
To enable the following instructions: SSE3 SSE4.1 SSE4.2 AVX AVX2 FMA, in other operations, rebuild TensorFlow with the appropriate compiler flags.
Epoch 1/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 9s 25ms/step - accuracy: 0.6583 - loss: 1.0760 - val_accuracy: 0.7839 - val_loss: 0.6416
Epoch 2/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 7s 23ms/step - accuracy: 0.7783 - loss: 0.6693 - val_accuracy: 0.8272 - val_loss: 0.5130
Epoch 3/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 7s 23ms/step - accuracy: 0.8249 - loss: 0.5159 - val_accuracy: 0.8551 - val_loss: 0.4318
Epoch 4/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 8s 27ms/step - accuracy: 0.8502 - loss: 0.4467 - val_accuracy: 0.8588 - val_loss: 0.4036
Epoch 5/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 9s 28ms/step - accuracy: 0.8629 - loss: 0.3960 - val_accuracy: 0.8685 - val_loss: 0.3861
Epoch 6/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 8s 27ms/step - accuracy: 0.8804 - loss: 0.3444 - val_accuracy: 0.8839 - val_loss: 0.3648
Epoch 7/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 9s 28ms/step - accuracy: 0.8904 - loss: 0.3125 - val_accuracy: 0.8932 - val_loss: 0.3343
Epoch 8/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 9s 28ms/step - accuracy: 0.8978 - loss: 0.2827 - val_accuracy: 0.8960 - val_loss: 0.3395
Epoch 9/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 8s 27ms/step - accuracy: 0.9084 - loss: 0.2662 - val_accuracy: 0.8940 - val_loss: 0.3411
Epoch 10/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 8s 27ms/step - accuracy: 0.9127 - loss: 0.2509 - val_accuracy: 0.8976 - val_loss: 0.3445
Epoch 11/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 9s 24ms/step - accuracy: 0.9152 - loss: 0.2442 - val_accuracy: 0.8980 - val_loss: 0.3464
Epoch 12/50
309/309 ━━━━━━━━━━━━━━━━━━━━ 7s 24ms/step - accuracy: 0.9233 - loss: 0.2187 - val_accuracy: 0.8883 - val_loss: 0.3788

MLP Test: 89.32%

MLP Per-class report:
                                precision    recall  f1-score   support

               acne-blackheads       0.91      0.91      0.91       180
                     acne-cyst       0.83      0.83      0.83       121
                   acne-fungal       0.91      0.98      0.94       121
                  acne-nodules       0.81      0.96      0.88       151
                  acne-papules       0.83      0.67      0.74       180
                 acne-pustules       0.79      0.81      0.80       180
               acne-whiteheads       0.89      0.96      0.92       180
                        eczema       0.89      0.92      0.90       180
                enlarged-pores       1.00      0.97      0.98       180
                       melasma       0.96      0.96      0.96       180
                         milia       0.99      0.84      0.91       180
                  out-of-scope       0.92      0.88      0.90       120
    post-inflammatory-erythema       0.81      0.82      0.82       180
post-inflammatory-pigmentation       0.88      0.94      0.91       180
                     psoriasis       0.98      0.97      0.98       158

                      accuracy                           0.89      2471
                     macro avg       0.89      0.89      0.89      2471
                  weighted avg       0.89      0.89      0.89      2471

✅ MLP saved: ../trained_data/mlp_classifier.keras

==================================================
SUMMARY
==================================================
LR  Test Accuracy: 93.97%
RF  Test Accuracy: 86.93%
MLP Test Accuracy: 89.32%
Winner: LR
