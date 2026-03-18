=================================================
Training Logistic Regression...
==================================================

LR Train: 96.79%
LR Test:  80.99%

LR Per-class report:
                                         precision    recall  f1-score   support

                   acne-blackheads-mild       0.84      0.80      0.82        82
               acne-blackheads-moderate       0.89      0.88      0.89       125
                 acne-blackheads-severe       0.95      0.95      0.95       149
                              acne-cyst       0.90      0.86      0.88       121
                           acne-nodules       0.93      0.97      0.95       151
                      acne-papules-mild       0.87      0.86      0.86       139
                  acne-papules-moderate       0.65      0.64      0.65        78
                    acne-papules-severe       0.78      0.78      0.78        64
                     acne-pustules-mild       0.93      0.87      0.90       118
                 acne-pustules-moderate       0.81      0.88      0.84        66
                   acne-pustules-severe       0.87      0.93      0.90       122
                   acne-whiteheads-mild       0.88      0.83      0.86       108
               acne-whiteheads-moderate       0.82      0.83      0.82        48
                 acne-whiteheads-severe       0.85      1.00      0.92        23
                            eczema-mild       0.63      0.66      0.64       158
                        eczema-moderate       0.54      0.51      0.52       150
                          eczema-severe       0.55      0.57      0.56       114
                    enlarged-pores-mild       0.73      0.76      0.75       118
                enlarged-pores-moderate       0.75      0.77      0.76       112
                  enlarged-pores-severe       0.91      0.85      0.88       138
                           melasma-mild       0.81      0.76      0.78       104
                       melasma-moderate       0.89      0.86      0.88       143
                         melasma-severe       0.95      0.98      0.96       125
                             milia-mild       0.74      0.72      0.73       177
                         milia-moderate       0.53      0.53      0.53       134
                           milia-severe       0.34      0.42      0.38        43
                           out-of-scope       0.85      0.87      0.86       120
        post-inflammatory-erythema-mild       0.91      0.88      0.90        92
    post-inflammatory-erythema-moderate       0.42      0.48      0.45        33
      post-inflammatory-erythema-severe       0.73      0.65      0.69        91
    post-inflammatory-pigmentation-mild       0.90      0.88      0.89       128
post-inflammatory-pigmentation-moderate       0.95      0.95      0.95       128
  post-inflammatory-pigmentation-severe       0.93      0.98      0.95       127
                              psoriasis       0.96      0.97      0.96       158

                               accuracy                           0.81      3787
                              macro avg       0.79      0.80      0.80      3787
                           weighted avg       0.81      0.81      0.81      3787

✅ LR saved: ../trained_data/lr_classifier.pkl


LR  Test Accuracy: 80.99%
