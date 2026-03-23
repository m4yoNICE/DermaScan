Loading cached embeddings...
  Loaded acne-blackheads-mild: 573 embeddings
  Loaded acne-blackheads-moderate: 675 embeddings
  Loaded acne-blackheads-severe: 745 embeddings
  Loaded acne-cyst: 603 embeddings
  Loaded acne-fungal-mild: 349 embeddings
  Loaded acne-fungal-severe: 258 embeddings
  Loaded acne-nodules: 757 embeddings
  Loaded acne-papules-mild: 697 embeddings
  Loaded acne-papules-moderate: 390 embeddings
  Loaded acne-papules-severe: 319 embeddings
  Loaded acne-pustules-mild: 588 embeddings
  Loaded acne-pustules-moderate: 328 embeddings
  Loaded acne-pustules-severe: 612 embeddings
  Loaded acne-whiteheads-mild: 821 embeddings
  Loaded acne-whiteheads-moderate: 240 embeddings
  Loaded acne-whiteheads-severe: 116 embeddings
  Loaded eczema-mild: 788 embeddings
  Loaded eczema-moderate: 751 embeddings
  Loaded eczema-severe: 570 embeddings
  Loaded enlarged-pores-mild: 590 embeddings
  Loaded enlarged-pores-moderate: 559 embeddings
  Loaded enlarged-pores-severe: 691 embeddings
  Loaded melasma-mild: 520 embeddings
  Loaded melasma-moderate: 713 embeddings
  Loaded melasma-severe: 627 embeddings
  Loaded milia-mild: 887 embeddings
  Loaded milia-moderate: 671 embeddings
  Loaded milia-severe: 218 embeddings
  Loaded out-of-scope: 600 embeddings
  Loaded post-inflammatory-erythema-mild: 458 embeddings
  Loaded post-inflammatory-erythema-moderate: 166 embeddings
  Loaded post-inflammatory-erythema-severe: 454 embeddings
  Loaded post-inflammatory-pigmentation-mild: 638 embeddings
  Loaded post-inflammatory-pigmentation-moderate: 638 embeddings
  Loaded post-inflammatory-pigmentation-severe: 634 embeddings
  Skipping psoriasis

Total: (19244, 6144)

==================================================
Training Stage 1: Condition Classifier
==================================================
Conditions (14): ['acne-blackheads', 'acne-cyst', 'acne-fungal', 'acne-nodules', 'acne-papules', 'acne-pustules', 'acne-whiteheads', 'eczema', 'enlarged-pores', 'melasma', 'milia', 'out-of-scope', 'post-inflammatory-erythema', 'post-inflammatory-pigmentation']
Stage 1 Train: 99.93%
Stage 1 Test:  94.88%

Per-class report:
                                precision    recall  f1-score   support

               acne-blackheads       0.96      0.95      0.95       399
                     acne-cyst       0.91      0.88      0.89       121
                   acne-fungal       0.97      1.00      0.98       121
                  acne-nodules       0.96      0.94      0.95       151
                  acne-papules       0.94      0.94      0.94       281
                 acne-pustules       0.96      0.96      0.96       306
               acne-whiteheads       0.97      0.95      0.96       235
                        eczema       0.96      0.97      0.96       422
                enlarged-pores       0.99      0.98      0.98       368
                       melasma       0.98      0.95      0.96       372
                         milia       0.95      0.97      0.96       355
                  out-of-scope       0.82      0.88      0.85       120
    post-inflammatory-erythema       0.87      0.84      0.85       216
post-inflammatory-pigmentation       0.95      0.97      0.96       382

                      accuracy                           0.95      3849
                     macro avg       0.94      0.94      0.94      3849
                  weighted avg       0.95      0.95      0.95      3849

Stage 1 saved.

==================================================
Training Stage 2: Severity Classifiers
==================================================

[acne-blackheads] 1993 samples, classes: ['mild', 'moderate', 'severe']
  Train: 100.00% | Test: 89.22%
              precision    recall  f1-score   support

        mild       0.90      0.84      0.87       115
    moderate       0.86      0.89      0.88       135
      severe       0.91      0.93      0.92       149

    accuracy                           0.89       399
   macro avg       0.89      0.89      0.89       399
weighted avg       0.89      0.89      0.89       399

  Saved: ../trained_data/two_stage\stage2_acne-blackheads.pkl

[acne-cyst] No severity variants — skipping

[acne-fungal] 607 samples, classes: ['mild', 'severe']
  Train: 99.18% | Test: 98.36%
              precision    recall  f1-score   support

        mild       0.99      0.99      0.99        70
      severe       0.98      0.98      0.98        52

    accuracy                           0.98       122
   macro avg       0.98      0.98      0.98       122
weighted avg       0.98      0.98      0.98       122

  Saved: ../trained_data/two_stage\stage2_acne-fungal.pkl

[acne-nodules] No severity variants — skipping

[acne-papules] 1406 samples, classes: ['mild', 'moderate', 'severe']
  Train: 99.38% | Test: 86.52%
              precision    recall  f1-score   support

        mild       0.94      0.92      0.93       140
    moderate       0.74      0.85      0.79        78
      severe       0.88      0.77      0.82        64

    accuracy                           0.87       282
   macro avg       0.85      0.84      0.85       282
weighted avg       0.87      0.87      0.87       282

  Saved: ../trained_data/two_stage\stage2_acne-papules.pkl

[acne-pustules] 1528 samples, classes: ['mild', 'moderate', 'severe']
  Train: 97.30% | Test: 90.85%
              precision    recall  f1-score   support

        mild       0.91      0.91      0.91       118
    moderate       0.84      0.88      0.86        66
      severe       0.94      0.93      0.93       122

    accuracy                           0.91       306
   macro avg       0.90      0.90      0.90       306
weighted avg       0.91      0.91      0.91       306

  Saved: ../trained_data/two_stage\stage2_acne-pustules.pkl

[acne-whiteheads] 1177 samples, classes: ['mild', 'moderate', 'severe']
  Train: 98.30% | Test: 91.95%
              precision    recall  f1-score   support

        mild       0.95      0.94      0.94       165
    moderate       0.80      0.81      0.80        48
      severe       1.00      1.00      1.00        23

    accuracy                           0.92       236
   macro avg       0.91      0.92      0.92       236
weighted avg       0.92      0.92      0.92       236

  Saved: ../trained_data/two_stage\stage2_acne-whiteheads.pkl

[eczema] 2109 samples, classes: ['mild', 'moderate', 'severe']
  Train: 95.20% | Test: 55.21%
              precision    recall  f1-score   support

        mild       0.60      0.65      0.62       158
    moderate       0.49      0.46      0.47       150
      severe       0.56      0.54      0.55       114

    accuracy                           0.55       422
   macro avg       0.55      0.55      0.55       422
weighted avg       0.55      0.55      0.55       422

  Saved: ../trained_data/two_stage\stage2_eczema.pkl

[enlarged-pores] 1840 samples, classes: ['mild', 'moderate', 'severe']
  Train: 92.60% | Test: 82.61%
              precision    recall  f1-score   support

        mild       0.78      0.78      0.78       118
    moderate       0.80      0.77      0.79       112
      severe       0.88      0.91      0.90       138

    accuracy                           0.83       368
   macro avg       0.82      0.82      0.82       368
weighted avg       0.83      0.83      0.83       368

  Saved: ../trained_data/two_stage\stage2_enlarged-pores.pkl

[melasma] 1860 samples, classes: ['mild', 'moderate', 'severe']
  Train: 96.84% | Test: 84.68%
              precision    recall  f1-score   support

        mild       0.75      0.74      0.74       104
    moderate       0.81      0.83      0.82       143
      severe       0.97      0.96      0.96       125

    accuracy                           0.85       372
   macro avg       0.84      0.84      0.84       372
classes: ['mild', 'moderate', 'severe']
  Train: 100.00% | Test: 86.11%
              precision    recall  f1-score   support

        mild       0.90      0.96      0.93        92
    moderate       0.70      0.48      0.57        33
      severe       0.86      0.90      0.88        91

    accuracy                           0.86       216
   macro avg       0.82      0.78      0.79       216
weighted avg       0.85      0.86      0.85       216

  Saved: ../trained_data/two_stage\stage2_post-inflammatory-erythema.pkl

[post-inflammatory-pigmentation] 1910 samples, classes: ['mild', 'moderate', 'severe']
  Train: 99.35% | Test: 96.34%
              precision    recall  f1-score   support

        mild       0.97      0.95      0.96       128
    moderate       0.97      0.98      0.97       127
      severe       0.95      0.97      0.96       127

    accuracy                           0.96       382
   macro avg       0.96      0.96      0.96       382
weighted avg       0.96      0.96      0.96       382

  Saved: ../trained_data/two_stage\stage2_post-inflammatory-pigmentation.pkl

==================================================
DONE
==================================================
Stage 1 conditions: 14
Stage 2 severity models trained: 11
Conditions with no severity model: {'acne-cyst', 'out-of-scope', 'acne-nodules'}
PS C:\Codes\CAPSTONE\DermaScan\ai\train>