-- CreateTable
CREATE TABLE "ProductCategoryMap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "ProductCategoryMap_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductCategoryMap_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProductCategoryMap_categoryId_idx" ON "ProductCategoryMap"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategoryMap_productId_categoryId_key" ON "ProductCategoryMap"("productId", "categoryId");
