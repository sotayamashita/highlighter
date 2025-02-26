import { useState, useEffect } from "react";
import type { Highlight } from "~/types/highlight";
import { highlightColors, defaultHighlightColor } from "~/lib/colors";
import { defaultContent } from "~/lib/defaultContent";

export function useFileOperations(
  setHighlights: (highlights: Highlight[]) => void,
) {
  const [content, setContent] = useState(defaultContent);

  // コンポーネントのマウント時に初期コンテンツからハイライトを抽出
  useEffect(() => {
    if (typeof document !== "undefined") {
      // サーバーサイドレンダリング時にはDOMParserが利用できないため、
      // クライアントサイドでのみ実行
      const { highlights } = extractHighlightsFromMarkTags(defaultContent);
      setHighlights(highlights);
    }
  }, []); // 空の依存配列で初回のみ実行

  // markタグからハイライト情報を抽出する関数
  const extractHighlightsFromMarkTags = (text: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${text}</div>`, "text/html");
    const markElements = doc.getElementsByTagName("mark");
    const highlights: Highlight[] = [];

    Array.from(markElements).forEach((mark) => {
      const text = mark.textContent || "";
      const color = mark.style.backgroundColor || defaultHighlightColor; // デフォルトは共通定義の黄色
      const highlightId = crypto.randomUUID();

      // コメントがあれば取得
      const comment = mark.getAttribute("data-comment") || "";

      const highlight: Highlight = {
        id: highlightId,
        text,
        createdAt: new Date(),
        color,
        comment,
        // ダミーの値を設定（実際の位置情報は利用できないため）
        startOffset: 0,
        endOffset: text.length,
      };

      // markタグにハイライトIDを設定
      mark.setAttribute("data-highlight-id", highlightId);

      highlights.push(highlight);
    });

    // markタグを含むHTMLを返す
    return {
      processedContent: doc.body.innerHTML,
      highlights,
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;

      // markタグがあるか確認
      if (text.includes("<mark")) {
        // markタグからハイライト情報を抽出
        const { processedContent, highlights } =
          extractHighlightsFromMarkTags(text);
        setContent(processedContent);
        setHighlights(highlights);
      } else {
        // 通常のテキスト処理
        setContent(text);
        setHighlights([]);
      }
    };
    reader.readAsText(file);
  };

  // ハイライトを削除する関数
  const removeHighlightFromContent = (
    highlightId: string,
    highlightText?: string,
  ) => {
    // 正規表現でマークタグを検索して削除
    const markRegexWithId = new RegExp(
      `<mark[^>]*data-highlight-id="${highlightId}"[^>]*>(.*?)<\/mark>`,
      "g",
    );

    // IDで見つかった場合はそれを置換
    if (content.match(markRegexWithId)) {
      setContent((prevContent) => prevContent.replace(markRegexWithId, "$1"));
      return;
    }

    // IDで見つからない場合は、ハイライトされたテキストを取得
    const markElement = document.querySelector(
      `mark[data-highlight-id="${highlightId}"]`,
    );

    if (markElement) {
      const text = markElement.textContent || "";
      if (text) {
        // テキスト内容でマークタグを検索（エスケープして正規表現で使用）
        const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const markRegexWithText = new RegExp(
          `<mark[^>]*>(${escapedText})<\/mark>`,
          "g",
        );
        setContent((prevContent) =>
          prevContent.replace(markRegexWithText, "$1"),
        );
      }
    } else if (highlightText) {
      // DOMに要素がない場合でも、テキストが提供されていれば使用
      const escapedText = highlightText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const markRegexWithText = new RegExp(
        `<mark[^>]*>(${escapedText})<\/mark>`,
        "g",
      );
      setContent((prevContent) => prevContent.replace(markRegexWithText, "$1"));
    }
  };

  const handleDownload = () => {
    const contentDiv = document.querySelector(".prose");
    if (!contentDiv) return;

    let mdContent = content;
    const marks = Array.from(contentDiv.getElementsByTagName("mark"));

    marks.forEach((mark) => {
      const color = mark.style.backgroundColor;
      const text = mark.textContent;
      const comment = mark.getAttribute("data-comment") || "";

      // コメントがあれば追加
      const commentAttr = comment ? ` data-comment="${comment}"` : "";
      const highlightSyntax = `<mark style="background-color: ${color}"${commentAttr}>${text}</mark>`;

      // テキストを置換する際に、同じテキストが複数ある場合に問題が発生する可能性があるため、
      // 一意のIDを使用して特定のmarkタグを識別する
      const highlightId = mark.getAttribute("data-highlight-id");
      if (highlightId) {
        const markRegex = new RegExp(
          `<mark[^>]*data-highlight-id="${highlightId}"[^>]*>.*?<\/mark>`,
          "g",
        );
        mdContent = mdContent.replace(markRegex, highlightSyntax);
      } else {
        // 後方互換性のために、IDがない場合はテキストで置換
        mdContent = mdContent.replace(text!, highlightSyntax);
      }
    });

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "highlighted-content.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    content,
    handleFileUpload,
    handleDownload,
    removeHighlightFromContent,
  };
}
