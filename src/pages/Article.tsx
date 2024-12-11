import { useEffect, useState } from "react";
import "../style/article.css";

type Article = {
  id: string;
  boolean: boolean;
  phone: string;
  date: number;
  tags: string[];
  sex: string;
  firstname: string;
  surname: string;
  email: string;
  title: string;
  intro: string;
  body: string;
  personal_code: number;
  image: {
    large: string;
    medium: string;
    small: string;
    alt: string;
    title: string;
  };
  images: {
    large: string;
    medium: string;
    small: string;
    alt: string;
    title: string;
  }[];
};

export default function Article() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchArticle = async () => {
    try {
      const response = await fetch(
        "https://proovitoo.twn.ee/api/list/972d2b8a"
      );
      const data = await response.json();
      setArticle(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>{article?.title}</h1>
          <p
            style={{ fontWeight: 900 }}
            dangerouslySetInnerHTML={{ __html: article?.intro ?? "" }}
          />
          <div
            className="image-container"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundSize = "120%";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundSize = "100%";
            }}
            style={{
              backgroundImage: `url(${article?.image.large})`,
              backgroundSize: "110%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
              transition: "background-size 0.2s ease-in-out",
              height: "auto",
              aspectRatio: "16/9",
              maxHeight: "500px",
            }}
          >
            <div
              style={{
                bottom: 0,
                left: 0,
                width: "100%",
                height: "100%",
                position: "relative",
                backdropFilter: "blur(7px)",
              }}
            >
              <img
                src={article?.image.large}
                alt={article?.image.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
              <div
                className="caption"
                style={{
                  color: "white",
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <div style={{ padding: "10px 24px" }}>
                  {article?.image.title ?? "No caption available"}
                </div>
              </div>
            </div>
          </div>
          <p dangerouslySetInnerHTML={{ __html: article?.body ?? "" }} />
          {article?.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
