import { Metadata } from "next";

type TAuthor = {
    name: string;
    url: string;
}

type TOpenGraph = {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: {
        url: string;
        width: number;
        height: number;
        alt: string;
    }[];
}

interface ICreateMetaData {
    title?: string;
    description?: string;
    keywords?: string[];
    authors?: TAuthor[];
    openGraph?: TOpenGraph;
}

export default function createMetaData({
    title = "",
    description = "",
    keywords = [],
    authors = [],
    openGraph = {
        title: "",
        description: "",
        url: "",
        siteName: "",
        images: [
            {
                url: "",
                width: 1200,
                height: 630,
                alt: "",
            },
        ],
    },
}: ICreateMetaData): Metadata {
    return (
        {
            title,
            description,
            keywords,
            authors,
            openGraph,
        }
    )
}
