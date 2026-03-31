PS C:\Codes\CAPSTONE\DermaScan\AI_multilabel\dermfoundation> python train_classifier.py
📦 Loading from per-class caches...
[acne-blackheads-mild] — 409 embeddings
[acne-blackheads-moderate] — 626 embeddings
[acne-blackheads-severe] — 745 embeddings
[acne-cyst] — 603 embeddings
[acne-nodules] — 757 embeddings
[acne-papules-mild] — 697 embeddings
[acne-papules-moderate] — 390 embeddings
[acne-papules-severe] — 319 embeddings
[acne-pustules-mild] — 588 embeddings
[acne-pustules-moderate] — 328 embeddings
[acne-pustules-severe] — 612 embeddings
[acne-whiteheads-mild] — 541 embeddings
[acne-whiteheads-moderate] — 240 embeddings
[acne-whiteheads-severe] — 116 embeddings
[eczema-mild] — 788 embeddings
[eczema-moderate] — 751 embeddings
[eczema-severe] — 570 embeddings
[enlarged-pores-mild] — 590 embeddings
[enlarged-pores-moderate] — 559 embeddings
[enlarged-pores-severe] — 691 embeddings
[melasma-mild] — 520 embeddings
[melasma-moderate] — 713 embeddings
[melasma-severe] — 627 embeddings
[milia-mild] — 887 embeddings
[milia-moderate] — 671 embeddings
[milia-severe] — 218 embeddings
[out-of-scope] — 600 embeddings
[post-inflammatory-erythema-mild] — 458 embeddings
[post-inflammatory-erythema-moderate] — 166 embeddings
[post-inflammatory-erythema-severe] — 454 embeddings
[post-inflammatory-pigmentation-mild] — 638 embeddings
[post-inflammatory-pigmentation-moderate] — 638 embeddings
[post-inflammatory-pigmentation-severe] — 634 embeddings
[psoriasis] — 788 embeddings

✅ Total: (18932, 6144)

✅ Labels (47): ['acne-blackheads', 'acne-blackheads-mild', 'acne-blackheads-moderate', 'acne-blackheads-severe', 'acne-cyst', 'acne-nodules', 'acne-papules', 'acne-papules-mild', 'acne-papules-moderate', 'acne-papules-severe', 'acne-pustules', 'acne-pustules-mild', 'acne-pustules-moderate', 'acne-pustules-severe', 'acne-whiteheads', 'acne-whiteheads-mild', 'acne-whiteheads-moderate', 'acne-whiteheads-severe', 'eczema', 'eczema-mild', 'eczema-moderate', 'eczema-severe', 'enlarged-pores', 'enlarged-pores-mild', 'enlarged-pores-moderate', 'enlarged-pores-severe', 'melasma', 'melasma-mild', 'melasma-moderate', 'melasma-severe', 'mild', 'milia', 'milia-mild', 'milia-moderate', 'milia-severe', 'moderate', 'out-of-scope', 'post-inflammatory-erythema', 'post-inflammatory-erythema-mild', 'post-inflammatory-erythema-moderate', 'post-inflammatory-erythema-severe', 'post-inflammatory-pigmentation', 'post-inflammatory-pigmentation-mild', 'post-inflammatory-pigmentation-moderate', 'post-inflammatory-pigmentation-severe', 'psoriasis', 'severe']
y_bin shape: (18932, 47)
✅ MLB saved: ../trained_data/mlb.pkl

==================================================
Training MultiOutputClassifier (LR per label)...
==================================================
y_pred shape: (3787, 47)

### Hamming Loss: 0.0190 ###
(Lower is better. 0.0 = perfect, 1.0 = worst)

Per-label report:
C:\Users\batma\AppData\Local\Programs\Python\Python312\Lib\site-packages\sklearn\metrics\_classification.py:1565: UndefinedMetricWarning: Precision is ill-defined and being set to 0.0 in samples with no predicted labels. Use `zero_division` parameter to control this behavior.
  _warn_prf(average, modifier, f"{metric.capitalize()} is", len(result))
                                         precision    recall  f1-score   support

                        acne-blackheads       0.99      0.94      0.96       345
                   acne-blackheads-mild       0.91      0.74      0.82        84
               acne-blackheads-moderate       0.90      0.88      0.89       108
                 acne-blackheads-severe       0.95      0.90      0.92       153
                              acne-cyst       0.93      0.92      0.93       114
                           acne-nodules       0.97      0.95      0.96       152
                           acne-papules       0.92      0.87      0.89       285
                      acne-papules-mild       0.89      0.83      0.86       138
                  acne-papules-moderate       0.71      0.55      0.62        82
                    acne-papules-severe       0.82      0.77      0.79        65
                          acne-pustules       0.95      0.95      0.95       331
                     acne-pustules-mild       0.92      0.82      0.87       133
                 acne-pustules-moderate       0.72      0.77      0.75        57
                   acne-pustules-severe       0.92      0.91      0.92       141
                        acne-whiteheads       0.98      0.94      0.96       185
                   acne-whiteheads-mild       0.88      0.76      0.82       109
               acne-whiteheads-moderate       0.87      0.79      0.83        52
                 acne-whiteheads-severe       1.00      0.67      0.80        24
                                 eczema       0.98      0.95      0.96       451
                            eczema-mild       0.59      0.64      0.61       157
                        eczema-moderate       0.54      0.40      0.46       172
                          eczema-severe       0.58      0.57      0.57       122
                         enlarged-pores       1.00      0.98      0.99       375
                    enlarged-pores-mild       0.73      0.78      0.75       120
                enlarged-pores-moderate       0.77      0.73      0.75       117
                  enlarged-pores-severe       0.90      0.80      0.85       138
                                melasma       0.99      0.99      0.99       350
                           melasma-mild       0.84      0.74      0.79        94
                       melasma-moderate       0.85      0.88      0.86       132
                         melasma-severe       0.98      0.98      0.98       124
                                   mild       0.77      0.77      0.77      1236
                                  milia       0.97      0.96      0.97       370
                             milia-mild       0.78      0.66      0.72       192
                         milia-moderate       0.57      0.57      0.57       134
                           milia-severe       0.39      0.36      0.38        44
                               moderate       0.69      0.68      0.68      1023
                           out-of-scope       0.92      0.80      0.86       112
             post-inflammatory-erythema       0.90      0.85      0.88       199
        post-inflammatory-erythema-mild       0.88      0.89      0.89        84
    post-inflammatory-erythema-moderate       0.47      0.26      0.34        34
      post-inflammatory-erythema-severe       0.74      0.63      0.68        81
         post-inflammatory-pigmentation       0.98      0.96      0.97       371
    post-inflammatory-pigmentation-mild       0.94      0.83      0.88       125
post-inflammatory-pigmentation-moderate       0.94      0.95      0.94       135
  post-inflammatory-pigmentation-severe       0.92      0.98      0.95       111
                              psoriasis       0.99      0.97      0.98       147
                                 severe       0.77      0.79      0.78      1003

                              micro avg       0.85      0.82      0.83     10311
                              macro avg       0.84      0.79      0.82     10311
                           weighted avg       0.85      0.82      0.83     10311
                            samples avg       0.85      0.83      0.83     10311

✅ Model saved: ../trained_data/lr_classifier.pkl

==================================================
SUMMARY
==================================================
Hamming Loss: 0.0190
Labels: 47
Train samples: 15145
Test samples: 3787
PS C:\Codes\CAPSTONE\DermaScan\AI_multilabel\dermfoundation> 