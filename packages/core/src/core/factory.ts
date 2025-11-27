import { MagicStringAST } from "magic-string-ast";
import type { Comment } from "oxc-parser";
import { parseSync } from "oxc-parser";
import type { UnpluginFactory } from "unplugin";
import { createFilter } from "unplugin-utils";
import type { FilterPattern } from "unplugin-utils";
import type { Options } from "../types";

const KEEP_KEY = "!__KP__";

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}, meta) => {
  const opts = Object.assign({
    comments: [],
    include: "**/*.{js,jsx,ts,tsx}"
  } satisfies Options, options);

  const filter = createFilter(opts.include, opts.exclude);
  const commentsFilter = createCommentsFilter(opts.comments);

  return {
    name: "unplugin-keep-comments",
    enforce: "pre",
    transform: {
      // rollup doesn't support `enforce`, use `order` instead
      order: meta.framework === "rollup" ? "pre" : undefined,
      handler(code, id) {
        if (!filter(id)) {
          return;
        }

        const ms = new MagicStringAST(code);

        const ast = parseSync(extractFileName(id), code);

        for (const comment of ast.comments) {
          const value = getCommentValue(comment);

          if (!commentsFilter(value)) {
            continue;
          }

          ms.overwriteNode(
            comment,
            `${value.slice(0, 2)}${KEEP_KEY}${value.slice(2)}`
          );
        }

        if (!ms.hasChanged()) {
          return;
        }

        return {
          code: ms.toString(),
          map: ms.generateMap({
            hires: true
          })
        };
      }
    },
    rollup: {
      generateBundle(_, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type !== "chunk") {
            continue;
          }

          chunk.code = restoreKeptComments(chunk.fileName, chunk.code);
        }
      }
    },
    rolldown: {
      generateBundle(_, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type !== "chunk") {
            continue;
          }

          chunk.code = restoreKeptComments(chunk.fileName, chunk.code);
        }
      }
    }
  };
};

function createCommentsFilter(comments: FilterPattern | undefined): (id: string | unknown) => boolean {
  if (
    comments == null
    || (Array.isArray(comments) && comments.length === 0)
    || (typeof comments === "string" && comments.length === 0)
  ) {
    return () => false;
  }

  return createFilter(comments, undefined, {
    resolve: false
  });
}

function extractFileName(value: string): string {
  const match = value.match(/([^/?#]+)(\?|#|$)/);

  if (match == null) {
    return value;
  }

  return match[1];
}

function getCommentValue(comment: Comment): string {
  if (comment.type === "Line") {
    return `//${comment.value}`;
  }

  return `/*${comment.value}*/`;
}

function restoreKeptComments(fileName: string, code: string): string {
  if (!code.includes(KEEP_KEY)) {
    return code;
  }

  const ms = new MagicStringAST(code);

  const ast = parseSync(fileName, code);

  for (const comment of ast.comments) {
    if (!comment.value.startsWith(KEEP_KEY)) {
      continue;
    }

    ms.overwriteNode(
      comment,
      getCommentValue(comment).replace(KEEP_KEY, "")
    );
  }

  return ms.toString();
}