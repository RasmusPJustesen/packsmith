export interface CurseForgeLinks {
    websiteUrl: string;
    wikiUrl: string | null;
    issuesUrl: string | null;
    sourceUrl: string | null;
}

export interface CurseForgeCategory {
    id: number;
    gameId: number;
    name: string;
    slug: string;
    url: string;
    iconUrl: string;
    dateModified: string;
    isClass: boolean;
    classId: number;
    parentCategoryId: number;
}

export interface CurseForgeAuthor {
    id: number;
    name: string;
    url: string;
    avatarUrl: string;
}

export interface CurseForgeAsset {
    id: number;
    modId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    url: string;
}

export interface CurseForgeHash {
    value: string;
    algo: number;
}

export interface CurseForgeModule {
    name: string;
    fingerprint: number;
}

export interface CurseForgeSortableGameVersion {
    gameVersionName: string;
    gameVersionPadded: string;
    gameVersion: string;
    gameVersionReleaseDate: string;
    gameVersionTypeId: number;
}

export interface CurseForgeFile {
    id: number;
    gameId: number;
    modId: number;
    isAvailable: boolean;
    displayName: string;
    fileName: string;
    releaseType: number;
    fileStatus: number;
    hashes: CurseForgeHash[];
    fileDate: string;
    fileLength: number;
    downloadCount: number;
    fileSizeOnDisk: number;
    downloadUrl: string;
    gameVersions: string[];
    sortableGameVersions: CurseForgeSortableGameVersion[];
    dependencies: unknown[];
    alternateFileId: number;
    isServerPack: boolean;
    serverPackFileId: number;
    fileFingerprint: number;
    modules: CurseForgeModule[];
}

export interface CurseForgeFileIndex {
    gameVersion: string;
    fileId: number;
    filename: string;
    releaseType: number;
    gameVersionTypeId: number;
    modLoader: number;
}

export interface CurseForgeServerAffiliation {
    isEnabled: boolean;
    isDefaultBanner: boolean;
    hasDiscount: boolean;
    affiliationService: number;
    defaultBannerCustomTitle: string;
    affiliationLink: string;
}

export interface CurseForgeSocialLink {
    type: number;
    url: string;
}

export interface CurseForgeModpack {
    screenshots: CurseForgeAsset[];
    id: number;
    gameId: number;
    name: string;
    slug: string;
    links: CurseForgeLinks;
    summary: string;
    status: number;
    downloadCount: number;
    isFeatured: boolean;
    primaryCategoryId: number;
    categories: CurseForgeCategory[];
    classId: number;
    authors: CurseForgeAuthor[];
    logo: CurseForgeAsset;
    mainFileId: number;
    latestFiles: CurseForgeFile[];
    latestFilesIndexes: CurseForgeFileIndex[];
    latestEarlyAccessFilesIndexes: CurseForgeFileIndex[];
    dateCreated: string;
    dateModified: string;
    dateReleased: string;
    allowModDistribution: boolean;
    gamePopularityRank: number;
    isAvailable: boolean;
    hasCommentsEnabled: boolean;
    thumbsUpCount: number;
    featuredProjectTag: number;
}

export interface CurseForgeMod {
    screenshots: CurseForgeAsset[];
    id: number;
    gameId: number;
    name: string;
    slug: string;
    links: CurseForgeLinks;
    summary: string;
    status: number;
    downloadCount: number;
    isFeatured: boolean;
    primaryCategoryId: number;
    categories: CurseForgeCategory[];
    classId: number;
    authors: CurseForgeAuthor[];
    logo: CurseForgeAsset;
    mainFileId: number;
    latestFiles: CurseForgeFile[];
    latestFilesIndexes: CurseForgeFileIndex[];
    latestEarlyAccessFilesIndexes: CurseForgeFileIndex[];
    dateCreated: string;
    dateModified: string;
    dateReleased: string;
    allowModDistribution: boolean;
    gamePopularityRank: number;
    isAvailable: boolean;
    hasCommentsEnabled: boolean;
    thumbsUpCount: number;
    serverAffiliation: CurseForgeServerAffiliation;
    socialLinks: CurseForgeSocialLink[];
    featuredProjectTag: number;
}
