
==================================================
Training Logistic Regression...
==================================================

LR Train: 96.92%
LR Test:  80.83%

LR Per-class report:
                                         precision    recall  f1-score   support

                   acne-blackheads-mild       0.88      0.80      0.84        82
               acne-blackheads-moderate       0.88      0.90      0.89       125
                 acne-blackheads-severe       0.93      0.94      0.94       149
                              acne-cyst       0.96      0.87      0.91       121
                       acne-fungal-mild       0.99      1.00      0.99        70
                     acne-fungal-severe       0.98      1.00      0.99        51
                           acne-nodules       0.92      0.97      0.95       151
                      acne-papules-mild       0.87      0.83      0.85       139
                  acne-papules-moderate       0.67      0.63      0.65        78
                    acne-papules-severe       0.73      0.80      0.76        64
                     acne-pustules-mild       0.87      0.87      0.87       118
                 acne-pustules-moderate       0.72      0.86      0.79        66
                   acne-pustules-severe       0.90      0.87      0.88       122
                   acne-whiteheads-mild       0.90      0.92      0.91       108
               acne-whiteheads-moderate       0.83      0.83      0.83        48
                 acne-whiteheads-severe       0.92      1.00      0.96        23
                            eczema-mild       0.56      0.56      0.56       158
                        eczema-moderate       0.44      0.47      0.45       150
                          eczema-severe       0.59      0.57      0.58       114
                    enlarged-pores-mild       0.83      0.77      0.80       118
                enlarged-pores-moderate       0.78      0.81      0.79       112
                  enlarged-pores-severe       0.89      0.88      0.89       138
                           melasma-mild       0.71      0.79      0.75       104
                       melasma-moderate       0.88      0.79      0.83       143
                         melasma-severe       0.94      0.98      0.96       125
                             milia-mild       0.71      0.76      0.73       177
                         milia-moderate       0.56      0.49      0.53       134
                           milia-severe       0.29      0.35      0.32        43
                           out-of-scope       0.84      0.79      0.82       120
        post-inflammatory-erythema-mild       0.91      0.89      0.90        92
    post-inflammatory-erythema-moderate       0.40      0.36      0.38        33
      post-inflammatory-erythema-severe       0.70      0.69      0.70        91
    post-inflammatory-pigmentation-mild       0.91      0.88      0.90       128
post-inflammatory-pigmentation-moderate       0.93      0.98      0.95       128
  post-inflammatory-pigmentation-severe       0.95      0.96      0.95       127
                              psoriasis       0.99      0.95      0.97       158

                               accuracy                           0.81      3908
                              macro avg       0.80      0.80      0.80      3908
                           weighted avg       0.81      0.81      0.81      3908

✅ LR saved: ../trained_data/lr_classifier.pkl

==================================================
Training Random Forest...
==================================================

RF Train: 97.61%
RF Test:  75.10%

RF Per-class report:
                                         precision    recall  f1-score   support

                   acne-blackheads-mild       0.92      0.60      0.73        82
               acne-blackheads-moderate       0.73      0.82      0.77       125
                 acne-blackheads-severe       0.76      0.88      0.81       149
                              acne-cyst       0.82      0.83      0.83       121
                       acne-fungal-mild       0.92      0.96      0.94        70
                     acne-fungal-severe       0.96      0.90      0.93        51
                           acne-nodules       0.85      0.95      0.90       151
                      acne-papules-mild       0.75      0.78      0.76       139
                  acne-papules-moderate       0.69      0.53      0.60        78
                    acne-papules-severe       0.84      0.58      0.69        64
                     acne-pustules-mild       0.91      0.82      0.86       118
                 acne-pustules-moderate       0.75      0.64      0.69        66
                   acne-pustules-severe       0.75      0.87      0.81       122
                   acne-whiteheads-mild       0.82      0.85      0.84       108
               acne-whiteheads-moderate       0.79      0.71      0.75        48
                 acne-whiteheads-severe       0.83      0.65      0.73        23
                            eczema-mild       0.48      0.57      0.52       158
                        eczema-moderate       0.41      0.43      0.42       150
                          eczema-severe       0.52      0.43      0.47       114
                    enlarged-pores-mild       0.80      0.75      0.77       118
                enlarged-pores-moderate       0.74      0.78      0.76       112
                  enlarged-pores-severe       0.84      0.84      0.84       138
                           melasma-mild       0.67      0.72      0.69       104
                       melasma-moderate       0.87      0.79      0.83       143
                         melasma-severe       0.90      0.98      0.94       125
                             milia-mild       0.65      0.75      0.69       177
                         milia-moderate       0.57      0.52      0.54       134
                           milia-severe       0.36      0.33      0.34        43
                           out-of-scope       0.89      0.72      0.80       120
        post-inflammatory-erythema-mild       0.75      0.83      0.78        92
    post-inflammatory-erythema-moderate       0.25      0.06      0.10        33
      post-inflammatory-erythema-severe       0.54      0.60      0.57        91
    post-inflammatory-pigmentation-mild       0.87      0.74      0.80       128
post-inflammatory-pigmentation-moderate       0.88      0.93      0.90       128
  post-inflammatory-pigmentation-severe       0.82      0.94      0.88       127
                              psoriasis       0.95      0.94      0.95       158

                               accuracy                           0.75      3908
                              macro avg       0.75      0.72      0.73      3908
                           weighted avg       0.75      0.75      0.75      3908

✅ RF saved: ../trained_data/rf_classifier.pkl

==================================================
Training MLP...
==================================================
Epoch 1/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 24ms/step - accuracy: 0.4201 - loss: 1.9314 - val_accuracy: 0.5926 - val_loss: 1.2419
Epoch 2/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 25ms/step - accuracy: 0.5618 - loss: 1.2827 - val_accuracy: 0.6395 - val_loss: 1.0073
Epoch 3/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 23ms/step - accuracy: 0.6167 - loss: 1.0861 - val_accuracy: 0.6789 - val_loss: 0.8933
Epoch 4/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 24ms/step - accuracy: 0.6552 - loss: 0.9624 - val_accuracy: 0.6812 - val_loss: 0.8455
Epoch 5/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 24ms/step - accuracy: 0.6841 - loss: 0.8736 - val_accuracy: 0.6988 - val_loss: 0.7979
Epoch 6/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 24ms/step - accuracy: 0.6990 - loss: 0.8149 - val_accuracy: 0.7165 - val_loss: 0.7447
Epoch 7/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 25ms/step - accuracy: 0.7172 - loss: 0.7438 - val_accuracy: 0.7175 - val_loss: 0.7157
Epoch 8/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 27ms/step - accuracy: 0.7290 - loss: 0.7149 - val_accuracy: 0.7272 - val_loss: 0.7034
Epoch 9/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 27ms/step - accuracy: 0.7417 - loss: 0.6785 - val_accuracy: 0.7364 - val_loss: 0.6733
Epoch 10/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 27ms/step - accuracy: 0.7490 - loss: 0.6548 - val_accuracy: 0.7357 - val_loss: 0.6972
Epoch 11/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 27ms/step - accuracy: 0.7587 - loss: 0.6173 - val_accuracy: 0.7298 - val_loss: 0.6809
Epoch 12/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 26ms/step - accuracy: 0.7667 - loss: 0.5972 - val_accuracy: 0.7720 - val_loss: 0.6228
Epoch 13/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 25ms/step - accuracy: 0.7657 - loss: 0.6095 - val_accuracy: 0.7492 - val_loss: 0.6624
Epoch 14/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 26ms/step - accuracy: 0.7792 - loss: 0.5672 - val_accuracy: 0.7715 - val_loss: 0.6165
Epoch 15/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 27ms/step - accuracy: 0.7821 - loss: 0.5452 - val_accuracy: 0.7651 - val_loss: 0.6328
Epoch 16/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 26ms/step - accuracy: 0.7877 - loss: 0.5349 - val_accuracy: 0.7735 - val_loss: 0.6402
Epoch 17/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 27ms/step - accuracy: 0.7920 - loss: 0.5300 - val_accuracy: 0.7738 - val_loss: 0.6226
Epoch 18/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 26ms/step - accuracy: 0.7985 - loss: 0.5050 - val_accuracy: 0.7779 - val_loss: 0.6170
Epoch 19/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 25ms/step - accuracy: 0.8012 - loss: 0.5129 - val_accuracy: 0.7805 - val_loss: 0.5963
Epoch 20/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 25ms/step - accuracy: 0.8085 - loss: 0.4834 - val_accuracy: 0.7779 - val_loss: 0.6039
Epoch 21/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 13s 26ms/step - accuracy: 0.8127 - loss: 0.4848 - val_accuracy: 0.7822 - val_loss: 0.5954
Epoch 22/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 19s 22ms/step - accuracy: 0.8142 - loss: 0.4627 - val_accuracy: 0.7848 - val_loss: 0.5810
Epoch 23/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 11s 23ms/step - accuracy: 0.8113 - loss: 0.4658 - val_accuracy: 0.7794 - val_loss: 0.5889
Epoch 24/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 11s 23ms/step - accuracy: 0.8169 - loss: 0.4531 - val_accuracy: 0.7766 - val_loss: 0.6014
Epoch 25/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 24ms/step - accuracy: 0.8158 - loss: 0.4574 - val_accuracy: 0.7648 - val_loss: 0.7040
Epoch 26/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 24ms/step - accuracy: 0.8253 - loss: 0.4421 - val_accuracy: 0.7636 - val_loss: 0.6717
Epoch 27/50
489/489 ━━━━━━━━━━━━━━━━━━━━ 12s 24ms/step - accuracy: 0.8289 - loss: 0.4117 - val_accuracy: 0.7897 - val_loss: 0.5818

MLP Test: 78.48%

MLP Per-class report:
                                         precision    recall  f1-score   support

                   acne-blackheads-mild       0.87      0.72      0.79        82
               acne-blackheads-moderate       0.83      0.87      0.85       125
                 acne-blackheads-severe       0.84      0.89      0.86       149
                              acne-cyst       0.88      0.88      0.88       121
                       acne-fungal-mild       0.98      0.93      0.96        70
                     acne-fungal-severe       0.94      1.00      0.97        51
                           acne-nodules       0.93      0.93      0.93       151
                      acne-papules-mild       0.91      0.83      0.87       139
                  acne-papules-moderate       0.69      0.72      0.70        78
                    acne-papules-severe       0.70      0.78      0.74        64
                     acne-pustules-mild       0.82      0.81      0.81       118
                 acne-pustules-moderate       0.61      0.86      0.72        66
                   acne-pustules-severe       0.94      0.81      0.87       122
                   acne-whiteheads-mild       0.88      0.83      0.86       108
               acne-whiteheads-moderate       0.79      0.92      0.85        48
                 acne-whiteheads-severe       0.88      1.00      0.94        23
                            eczema-mild       0.58      0.38      0.46       158
                        eczema-moderate       0.42      0.53      0.47       150
                          eczema-severe       0.54      0.61      0.57       114
                    enlarged-pores-mild       0.79      0.71      0.75       118
                enlarged-pores-moderate       0.73      0.93      0.82       112
                  enlarged-pores-severe       0.92      0.75      0.83       138
                           melasma-mild       0.70      0.80      0.75       104
                       melasma-moderate       0.84      0.80      0.82       143
                         melasma-severe       0.99      0.93      0.96       125
                             milia-mild       0.65      0.81      0.73       177
                         milia-moderate       0.63      0.28      0.38       134
                           milia-severe       0.30      0.65      0.41        43
                           out-of-scope       0.90      0.79      0.84       120
        post-inflammatory-erythema-mild       0.94      0.87      0.90        92
    post-inflammatory-erythema-moderate       0.32      0.42      0.36        33
      post-inflammatory-erythema-severe       0.66      0.68      0.67        91
    post-inflammatory-pigmentation-mild       0.94      0.84      0.89       128
post-inflammatory-pigmentation-moderate       0.92      0.96      0.94       128
  post-inflammatory-pigmentation-severe       0.95      0.95      0.95       127
                              psoriasis       0.99      0.94      0.96       158

                               accuracy                           0.78      3908
                              macro avg       0.78      0.79      0.78      3908
                           weighted avg       0.80      0.78      0.79      3908

✅ MLP saved: ../trained_data/mlp_classifier.keras

==================================================
SUMMARY
==================================================
LR  Test Accuracy: 80.83%
RF  Test Accuracy: 75.10%
MLP Test Accuracy: 78.48%
Winner: LR
