PS C:\Codes\CAPSTONE\DermaScan\ai\train> python two_way_train.py
Loading cached embeddings...
  Loaded acne-blackheads-mild: 219 embeddings
  Loaded acne-blackheads-moderate: 176 embeddings
  Loaded acne-blackheads-severe: 214 embeddings
  Loaded acne-cyst: 310 embeddings
  Loaded acne-fungal-mild: 349 embeddings
  Loaded acne-fungal-severe: 258 embeddings
  Loaded acne-nodules: 309 embeddings
  Loaded acne-papules-mild: 689 embeddings
  Loaded acne-papules-moderate: 310 embeddings
  Loaded acne-papules-severe: 312 embeddings
  Loaded acne-pustules-mild: 405 embeddings
  Loaded acne-pustules-moderate: 313 embeddings
  Loaded acne-pustules-severe: 396 embeddings
  Loaded acne-whiteheads-mild: 301 embeddings
  Loaded acne-whiteheads-moderate: 179 embeddings
  Loaded acne-whiteheads-severe: 215 embeddings
  Loaded eczema-mild: 788 embeddings
  Loaded eczema-moderate: 751 embeddings
  Loaded eczema-severe: 570 embeddings
  Loaded enlarged-pores-mild: 568 embeddings
  Loaded enlarged-pores-moderate: 670 embeddings
  Loaded enlarged-pores-severe: 677 embeddings
  Loaded melasma-mild: 512 embeddings
  Loaded melasma-moderate: 603 embeddings
  Loaded melasma-severe: 474 embeddings
  Loaded milia-mild: 114 embeddings
  Loaded milia-moderate: 490 embeddings
  Loaded milia-severe: 165 embeddings
  Loaded out-of-scope: 386 embeddings
  Loaded post-inflammatory-erythema-mild: 350 embeddings
  Loaded post-inflammatory-erythema-moderate: 138 embeddings
  Loaded post-inflammatory-erythema-severe: 318 embeddings
  Loaded post-inflammatory-hyperpigmentation-mild: 407 embeddings
  Loaded post-inflammatory-hyperpigmentation-moderate: 435 embeddings
  Loaded post-inflammatory-hyperpigmentation-severe: 261 embeddings
  Skipping psoriasis

Total: (13632, 6144)

==================================================
Training Stage 1: Condition Classifier
==================================================
Conditions (14): ['acne-blackheads', 'acne-cyst', 'acne-fungal', 'acne-nodules', 'acne-papules', 'acne-pustules', 'acne-whiteheads', 'eczema', 'enlarged-pores', 'melasma', 'milia', 'out-of-scope', 'post-inflammatory-erythema', 'post-inflammatory-hyperpigmentation']
Stage 1 Train: 100.00%
Stage 1 Test:  94.83%

Per-class report:
                                     precision    recall  f1-score   support

                    acne-blackheads       0.98      0.96      0.97       122
                          acne-cyst       0.80      0.76      0.78        62
                        acne-fungal       0.95      1.00      0.98       121
                       acne-nodules       0.77      0.94      0.85        62
                       acne-papules       0.92      0.95      0.93       262
                      acne-pustules       0.95      0.91      0.93       223
                    acne-whiteheads       0.99      0.98      0.98       139
                             eczema       0.95      0.99      0.97       422
                     enlarged-pores       0.99      0.99      0.99       383
                            melasma       0.98      0.96      0.97       318
                              milia       0.96      0.95      0.96       154
                       out-of-scope       1.00      0.95      0.97        77
         post-inflammatory-erythema       0.88      0.79      0.83       161
post-inflammatory-hyperpigmentation       0.92      0.95      0.94       221

                           accuracy                           0.95      2727
                          macro avg       0.93      0.93      0.93      2727
                       weighted avg       0.95      0.95      0.95      2727

Confusion matrix saved.
Stage 1 saved.

==================================================
Training Stage 2: Severity Classifiers
==================================================

[acne-blackheads] 609 samples, classes: ['mild', 'moderate', 'severe']
  Train: 99.59% | Test: 89.34%
              precision    recall  f1-score   support

        mild       0.95      0.95      0.95        44
    moderate       0.81      0.86      0.83        35
      severe       0.90      0.86      0.88        43

    accuracy                           0.89       122
   macro avg       0.89      0.89      0.89       122
weighted avg       0.89      0.89      0.89       122

  Saved: ../trained_data_two_stage\stage2_acne-blackheads.pkl

[acne-cyst] No severity variants — skipping

[acne-fungal] 607 samples, classes: ['mild', 'severe']
  Train: 99.18% | Test: 98.36%
              precision    recall  f1-score   support

        mild       0.99      0.99      0.99        70
      severe       0.98      0.98      0.98        52

    accuracy                           0.98       122
   macro avg       0.98      0.98      0.98       122
weighted avg       0.98      0.98      0.98       122

  Saved: ../trained_data_two_stage\stage2_acne-fungal.pkl

[acne-nodules] No severity variants — skipping

[acne-papules] 1311 samples, classes: ['mild', 'moderate', 'severe']
  Train: 98.85% | Test: 80.23%
              precision    recall  f1-score   support

        mild       0.90      0.89      0.89       138
    moderate       0.65      0.65      0.65        62
      severe       0.75      0.76      0.76        63

    accuracy                           0.80       263
   macro avg       0.76      0.77      0.77       263
weighted avg       0.80      0.80      0.80       263

  Saved: ../trained_data_two_stage\stage2_acne-papules.pkl

[acne-pustules] 1114 samples, classes: ['mild', 'moderate', 'severe']
  Train: 100.00% | Test: 92.83%
              precision    recall  f1-score   support

        mild       0.91      0.96      0.93        81
    moderate       0.92      0.86      0.89        63
      severe       0.96      0.95      0.96        79

    accuracy                           0.93       223
   macro avg       0.93      0.92      0.92       223
weighted avg       0.93      0.93      0.93       223

  Saved: ../trained_data_two_stage\stage2_acne-pustules.pkl

[acne-whiteheads] 695 samples, classes: ['mild', 'moderate', 'severe']
  Train: 99.10% | Test: 94.96%
              precision    recall  f1-score   support

        mild       1.00      0.98      0.99        60
    moderate       0.89      0.92      0.90        36
      severe       0.93      0.93      0.93        43

    accuracy                           0.95       139
   macro avg       0.94      0.94      0.94       139
weighted avg       0.95      0.95      0.95       139

  Saved: ../trained_data_two_stage\stage2_acne-whiteheads.pkl

[eczema] 2109 samples, classes: ['mild', 'moderate', 'severe']
  Train: 95.20% | Test: 55.21%
              precision    recall  f1-score   support

        mild       0.60      0.65      0.62       158
    moderate       0.49      0.46      0.47       150
      severe       0.56      0.54      0.55       114

    accuracy                           0.55       422
   macro avg       0.55      0.55      0.55       422
weighted avg       0.55      0.55      0.55       422

  Saved: ../trained_data_two_stage\stage2_eczema.pkl

[enlarged-pores] 1915 samples, classes: ['mild', 'moderate', 'severe']
  Train: 92.95% | Test: 86.68%
              precision    recall  f1-score   support

        mild       0.84      0.77      0.80       114
    moderate       0.83      0.90      0.86       134
      severe       0.93      0.91      0.92       135

    accuracy                           0.87       383
   macro avg       0.87      0.86      0.86       383
weighted avg       0.87      0.87      0.87       383

  Saved: ../trained_data_two_stage\stage2_enlarged-pores.pkl

[melasma] 1589 samples, classes: ['mild', 'moderate', 'severe']
  Train: 97.25% | Test: 94.03%
              precision    recall  f1-score   support

        mild       0.91      0.91      0.91       102
    moderate       0.93      0.92      0.92       121
      severe       0.99      1.00      0.99        95

    accuracy                           0.94       318
   macro avg       0.94      0.94      0.94       318
weighted avg       0.94      0.94      0.94       318

  Saved: ../trained_data_two_stage\stage2_melasma.pkl

[milia] 769 samples, classes: ['mild', 'moderate', 'severe']
  Train: 100.00% | Test: 70.78%
              precision    recall  f1-score   support

        mild       0.62      0.78      0.69        23
    moderate       0.80      0.77      0.78        98
      severe       0.52      0.48      0.50        33

    accuracy                           0.71       154
   macro avg       0.64      0.68      0.66       154
weighted avg       0.71      0.71      0.71       154

  Saved: ../trained_data_two_stage\stage2_milia.pkl

[out-of-scope] No severity variants — skipping

[post-inflammatory-erythema] 806 samples, classes: ['mild', 'moderate', 'severe']
  Train: 100.00% | Test: 79.63%
              precision    recall  f1-score   support

        mild       0.95      0.86      0.90        70
    moderate       0.46      0.68      0.55        28
      severe       0.86      0.78      0.82        64

    accuracy                           0.80       162
   macro avg       0.76      0.77      0.76       162
weighted avg       0.83      0.80      0.81       162

  Saved: ../trained_data_two_stage\stage2_post-inflammatory-erythema.pkl

[post-inflammatory-hyperpigmentation] 1103 samples, classes: ['mild', 'moderate', 'severe']
  Train: 99.66% | Test: 93.67%
              precision    recall  f1-score   support

        mild       0.94      0.94      0.94        82
    moderate       0.94      0.95      0.95        87
      severe       0.92      0.90      0.91        52

    accuracy                           0.94       221
   macro avg       0.93      0.93      0.93       221
weighted avg       0.94      0.94      0.94       221

  Saved: ../trained_data_two_stage\stage2_post-inflammatory-hyperpigmentation.pkl

==================================================
DONE
==================================================
Stage 1 conditions: 14
Stage 2 severity models trained: 11
Conditions with no severity model: {'out-of-scope', 'acne-nodules', 'acne-cyst'}
PS C:\Codes\CAPSTONE\DermaScan\ai\train> 