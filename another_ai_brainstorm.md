2. The “algo” – CNN vs classifier
   You are using a CNN; it’s just split into two parts:

Stage Component Role
1 Derm Foundation (BiT-M ResNet101) CNN backbone – produces embeddings
2 Logistic regression Linear classifier on embeddings
So the full pipeline is:

Image → CNN (Derm Foundation) → Embedding → Linear classifier (LR) → Single label

That’s exactly the kind of setup Google recommends (“train a linear classifier” on embeddings). You’re not misusing the architecture; the CNN is just frozen and used as a feature extractor.
