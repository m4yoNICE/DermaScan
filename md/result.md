✅ Embeddings cached: (2817, 6144)
✅ Classes (13): [np.str_('acne-blackheads'), np.str_('acne-cyst'), np.str_('acne-fungal'), np.str_('acne-nodules'), np.str_('acne-papules'), np.str_('acne-pustules'), np.str_('acne-whiteheads'), np.str_('eczema'), np.str_('enlarged-pores'), np.str_('melasma'), np.str_('milia'), np.str_('post-inflammatory-erythema'), np.str_('post-inflammatory-pigmentation')]

🔄 Training Logistic Regression...

============================================================
  Per-class report: Logistic Regression
============================================================
                                precision    recall  f1-score   support

               acne-blackheads       0.93      0.93      0.93        59
                     acne-cyst       0.95      0.93      0.94        40
                   acne-fungal       0.94      1.00      0.97        44
                  acne-nodules       0.95      0.93      0.94        60
                  acne-papules       0.93      0.98      0.95        41
                 acne-pustules       0.88      0.95      0.92        40
               acne-whiteheads       0.95      0.97      0.96        39
                        eczema       0.86      0.93      0.89        41
                enlarged-pores       0.98      1.00      0.99        41
                       melasma       1.00      1.00      1.00        40
                         milia       0.95      0.95      0.95        41
    post-inflammatory-erythema       0.93      0.69      0.79        39
post-inflammatory-pigmentation       1.00      0.97      0.99        39

                      accuracy                           0.94       564
                     macro avg       0.94      0.94      0.94       564
                  weighted avg       0.94      0.94      0.94       564

  acne-blackheads                          conf_correct=95.97%  conf_wrong=12.03%
  acne-cyst                                conf_correct=91.37%  conf_wrong=12.68%
  acne-fungal                              conf_correct=99.53%  conf_wrong=0.00%
  acne-nodules                             conf_correct=98.21%  conf_wrong=24.00%
  acne-papules                             conf_correct=99.04%  conf_wrong=38.64%
  acne-pustules                            conf_correct=94.30%  conf_wrong=1.63%
  acne-whiteheads                          conf_correct=98.10%  conf_wrong=18.93%
  eczema                                   conf_correct=93.21%  conf_wrong=3.93%
  enlarged-pores                           conf_correct=99.93%  conf_wrong=0.00%
  melasma                                  conf_correct=99.81%  conf_wrong=0.00%
  milia                                    conf_correct=96.00%  conf_wrong=23.99%
  post-inflammatory-erythema               conf_correct=95.06%  conf_wrong=15.39%
  post-inflammatory-pigmentation           conf_correct=99.50%  conf_wrong=9.31%
  ✅ Logistic Regression: accuracy=94.15%

🔄 Training SVM...

============================================================
  Per-class report: SVM
============================================================
                                precision    recall  f1-score   support

               acne-blackheads       0.93      0.86      0.89        59
                     acne-cyst       0.89      0.80      0.84        40
                   acne-fungal       0.94      1.00      0.97        44
                  acne-nodules       0.97      0.97      0.97        60
                  acne-papules       0.76      0.93      0.84        41
                 acne-pustules       0.91      0.80      0.85        40
               acne-whiteheads       0.97      0.97      0.97        39
                        eczema       0.80      0.88      0.84        41
                enlarged-pores       0.95      1.00      0.98        41
                       melasma       1.00      1.00      1.00        40
                         milia       0.95      0.88      0.91        41
    post-inflammatory-erythema       0.81      0.77      0.79        39
post-inflammatory-pigmentation       0.97      0.97      0.97        39

                      accuracy                           0.91       564
                     macro avg       0.91      0.91      0.91       564
                  weighted avg       0.91      0.91      0.91       564

  acne-blackheads                          conf_correct=88.02%  conf_wrong=13.66%
  acne-cyst                                conf_correct=79.96%  conf_wrong=26.67%
  acne-fungal                              conf_correct=95.84%  conf_wrong=0.00%
  acne-nodules                             conf_correct=91.36%  conf_wrong=6.56%
  acne-papules                             conf_correct=89.07%  conf_wrong=25.30%
  acne-pustules                            conf_correct=85.42%  conf_wrong=19.14%
  acne-whiteheads                          conf_correct=85.88%  conf_wrong=0.15%
  eczema                                   conf_correct=80.29%  conf_wrong=18.27%
  enlarged-pores                           conf_correct=96.84%  conf_wrong=0.00%
  melasma                                  conf_correct=96.08%  conf_wrong=0.00%
  milia                                    conf_correct=91.95%  conf_wrong=23.98%
  post-inflammatory-erythema               conf_correct=81.26%  conf_wrong=12.79%
  post-inflammatory-pigmentation           conf_correct=95.84%  conf_wrong=16.41%
  ✅ SVM: accuracy=91.13%

🔄 Training Random Forest...

============================================================
  Per-class report: Random Forest
============================================================
                                precision    recall  f1-score   support

               acne-blackheads       0.88      0.86      0.87        59
                     acne-cyst       0.92      0.90      0.91        40
                   acne-fungal       0.81      1.00      0.90        44
                  acne-nodules       0.92      0.97      0.94        60
                  acne-papules       0.85      0.95      0.90        41
                 acne-pustules       0.97      0.82      0.89        40
               acne-whiteheads       0.88      0.90      0.89        39
                        eczema       0.72      0.76      0.74        41
                enlarged-pores       0.95      1.00      0.98        41
                       melasma       0.98      1.00      0.99        40
                         milia       0.92      0.83      0.87        41
    post-inflammatory-erythema       0.86      0.62      0.72        39
post-inflammatory-pigmentation       0.95      0.92      0.94        39

                      accuracy                           0.89       564
                     macro avg       0.89      0.89      0.89       564
                  weighted avg       0.89      0.89      0.89       564

  acne-blackheads                          conf_correct=57.59%  conf_wrong=17.38%
  acne-cyst                                conf_correct=50.83%  conf_wrong=16.50%
  acne-fungal                              conf_correct=73.45%  conf_wrong=0.00%
  acne-nodules                             conf_correct=50.14%  conf_wrong=13.00%
  acne-papules                             conf_correct=70.38%  conf_wrong=14.00%
  acne-pustules                            conf_correct=59.39%  conf_wrong=16.57%
  acne-whiteheads                          conf_correct=53.29%  conf_wrong=17.75%
  eczema                                   conf_correct=35.81%  conf_wrong=15.70%
  enlarged-pores                           conf_correct=80.22%  conf_wrong=0.00%
  melasma                                  conf_correct=79.50%  conf_wrong=0.00%
  milia                                    conf_correct=62.24%  conf_wrong=15.14%
  post-inflammatory-erythema               conf_correct=43.13%  conf_wrong=17.20%
  post-inflammatory-pigmentation           conf_correct=69.47%  conf_wrong=24.00%
  ✅ Random Forest: accuracy=89.01%

🔄 Training MLP...
C:\Users\batma\AppData\Local\Programs\Python\Python312\Lib\site-packages\keras\src\layers\core\dense.py:106: UserWarning: Do not pass an `input_shape`/`input_dim` argument to a layer. When using Sequential models, prefer using an `Input(shape)` object as the first layer in the model instead.
  super().__init__(activity_regularizer=activity_regularizer, **kwargs)
Epoch 1/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 4s 29ms/step - accuracy: 0.5344 - loss: 1.4634 - val_accuracy: 0.7713 - val_loss: 0.7155
Epoch 2/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 27ms/step - accuracy: 0.7599 - loss: 0.7398 - val_accuracy: 0.8387 - val_loss: 0.5407
Epoch 3/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 26ms/step - accuracy: 0.8198 - loss: 0.5383 - val_accuracy: 0.8759 - val_loss: 0.3890
Epoch 4/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 27ms/step - accuracy: 0.8611 - loss: 0.4339 - val_accuracy: 0.8723 - val_loss: 0.3727
Epoch 5/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 25ms/step - accuracy: 0.8784 - loss: 0.3611 - val_accuracy: 0.8954 - val_loss: 0.3232
Epoch 6/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 26ms/step - accuracy: 0.9117 - loss: 0.2653 - val_accuracy: 0.9043 - val_loss: 0.3206
Epoch 7/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 25ms/step - accuracy: 0.9179 - loss: 0.2296 - val_accuracy: 0.9043 - val_loss: 0.2999
Epoch 8/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 25ms/step - accuracy: 0.9356 - loss: 0.1972 - val_accuracy: 0.9184 - val_loss: 0.2584
Epoch 9/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 26ms/step - accuracy: 0.9494 - loss: 0.1581 - val_accuracy: 0.9202 - val_loss: 0.2855
Epoch 10/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 24ms/step - accuracy: 0.9512 - loss: 0.1601 - val_accuracy: 0.9344 - val_loss: 0.2747
Epoch 11/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 23ms/step - accuracy: 0.9374 - loss: 0.2012 - val_accuracy: 0.9149 - val_loss: 0.3068
Epoch 12/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 23ms/step - accuracy: 0.9507 - loss: 0.1490 - val_accuracy: 0.9291 - val_loss: 0.2742
Epoch 13/50
71/71 ━━━━━━━━━━━━━━━━━━━━ 2s 27ms/step - accuracy: 0.9614 - loss: 0.1419 - val_accuracy: 0.9202 - val_loss: 0.2896
18/18 ━━━━━━━━━━━━━━━━━━━━ 0s 6ms/step 

============================================================
  Per-class report: MLP
============================================================
                                precision    recall  f1-score   support

               acne-blackheads       0.86      0.92      0.89        59
                     acne-cyst       0.88      0.90      0.89        40
                   acne-fungal       0.90      1.00      0.95        44
                  acne-nodules       0.95      0.95      0.95        60
                  acne-papules       0.88      0.93      0.90        41
                 acne-pustules       0.95      0.88      0.91        40
               acne-whiteheads       1.00      0.95      0.97        39
                        eczema       0.91      0.78      0.84        41
                enlarged-pores       0.98      1.00      0.99        41
                       melasma       1.00      0.97      0.99        40
                         milia       0.97      0.90      0.94        41
    post-inflammatory-erythema       0.77      0.77      0.77        39
post-inflammatory-pigmentation       0.93      0.97      0.95        39

                      accuracy                           0.92       564
                     macro avg       0.92      0.92      0.92       564
                  weighted avg       0.92      0.92      0.92       564

  acne-blackheads                          conf_correct=97.87%  conf_wrong=23.56%
  acne-cyst                                conf_correct=90.17%  conf_wrong=29.04%
  acne-fungal                              conf_correct=99.62%  conf_wrong=0.00%
  acne-nodules                             conf_correct=98.62%  conf_wrong=22.28%
  acne-papules                             conf_correct=91.65%  conf_wrong=19.52%
  acne-pustules                            conf_correct=87.98%  conf_wrong=12.66%
  acne-whiteheads                          conf_correct=96.85%  conf_wrong=11.49%
  eczema                                   conf_correct=89.80%  conf_wrong=12.36%
  enlarged-pores                           conf_correct=99.98%  conf_wrong=0.00%
  melasma                                  conf_correct=99.24%  conf_wrong=44.04%
  milia                                    conf_correct=98.44%  conf_wrong=12.65%
  post-inflammatory-erythema               conf_correct=95.04%  conf_wrong=18.28%
  post-inflammatory-pigmentation           conf_correct=99.61%  conf_wrong=0.07%
  ✅ MLP: accuracy=91.84%
✅ MLP saved to ../trained_data\mlp_classifier.keras
✅ Per-class report saved to ../trained_data\per_class_report.json
✅ Chart saved to ../trained_data\algorithm_comparison.png

📊 Final Results:
  Logistic Regression    acc=94.15%  f1=94.03%
  SVM                    acc=91.13%  f1=91.12%
  Random Forest          acc=89.01%  f1=88.82%
  MLP                    acc=91.84%  f1=91.81%
PS C:\Codes\CAPSTONE\DermaScan\ai_new\dermfoundation> 