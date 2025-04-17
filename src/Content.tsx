import { css } from "@emotion/css";
import React from "react";
import Lightbox from "./Lightbox";
import Markdown from "react-markdown";

const Content: React.FC<{ shapes: Shape[] }> = ({ shapes }) => {
  return (
    <div
      className={css`
        padding: 2rem;
        height: 30vh;
        overflow-y: scroll;
      `}
    >
      <div
        className={css`
          max-width: 800px;
          margin: 0 auto;
        `}
      >
        {shapes
          .sort((a, b) => ((a.number ?? 0) > (b.number ?? 0) ? 1 : -1))
          .map((shape, index) => {
            return (
              <section
                key={index}
                id={`marker-${shape.number}`}
                className={css`
                  padding: 2rem 0;
                  border-bottom: 1px solid #ccc;
                `}
              >
                <h2>
                  {shape.number}. {shape.title}
                </h2>

                <Lightbox images={shape.images ?? []} />
                <p>
                  <Markdown>{shape.description}</Markdown>
                </p>
              </section>
            );
          })}
      </div>
    </div>
  );
};

export default Content;
