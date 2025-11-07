-- CreateIndex
CREATE UNIQUE INDEX "unique_ministry_per_parish" ON "ministries"("name", "parishId");