-- CreateTable
CREATE TABLE "DesignStudio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "badge" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "DesignProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studioId" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "overlayLabel" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DesignProject_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "DesignStudio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
