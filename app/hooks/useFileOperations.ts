import { useState } from "react";
import type { Highlight } from "~/types/highlight";

const defaultContent = `
# Tailwind Typography

<p className="lead">
  これまでは、Tailwindで記事、文書、ブログ投稿のスタイルを整えようとすると、タイポグラフィに対する鋭い目と多くの複雑なカスタムCSSを必要とする退屈な作業でし
  た。
</p>

デフォルトでは、Tailwindは段落、見出し、リストなどのデフォルトのブラウザのスタイルをすべて削除します。これは、ユーザーエージェントのスタイルを元に戻す手間が
省けるため、アプリケーションのUIを構築する際にはとても便利なのですが、CMSやマークダウンファイルのリッチテキストエディタで作成されたコンテンツを本当にスタイリ
ングしようとすると、驚きと直感的でないことがあります。

実際、苦情は多いし、定期的にこんなことを聞かれる：

> なぜTailwindは、私のh1 要素のデフォルトスタイルを削除するのですか？どうすれば無効にできますか？他の基本スタイルも全て失うとはどういうことですか？

\`\`\`html
<article class="prose">
  <h1>Garlic bread with cheese: What the science tells us</h1>
  <p>
    For years parents have espoused the health benefits of eating garlic bread with cheese to their
    children, with the food earning such an iconic status in our culture that kids will often dress
    up as warm, cheesy loaf for Halloween.
  </p>
  <p>
    But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
    springing up around the country.
  </p>
</article>
\`\`\`

プラグインの使い方や含まれる機能の詳細については、[ドキュメントを読む](https://github.com/tailwindcss/typography/blob/main/README.md)。

## ここから先に期待すること

ここから先は、プラグインそのものをドッグフード化するために書いた、まったくナンセンスなものばかりだ。 **太字テキスト** 、順序なしリスト、順序付きリスト、コード
ブロック、ブロック引用符、そして _イタリック体_ など、私が思いつくあらゆるタイポグラフィの要素が含まれている。

これらのユースケースをすべてカバーすることが重要な理由はいくつかある：

1. 私たちは、箱から出してすぐに、すべてをよく見せたい。
2. 本当に最初の理由だけで、それがプラグインの要点です。
3. 3つ目の理由は、項目が2つのリストよりも3つのリストの方が現実的に見えるから。

では、別のヘッダー・スタイルを試してみましょう。

## 他にも必要な要素がある。

[Tailwind CSSのウェブサイトへのリンク](https://tailwindcss.com)のようなリンクについて言及するのを忘れるところだった。もう少しで青にするところでしたが、
それは昨日のことなので、ダークグレーにしました。

テーブルスタイルも含めて、チェックしてみてください：

| レスラー | 出身地 | フィニッシャー |
| --- | --- | --- |
| ストーンコールド・スティーブ・オースティン | テキサス州オースティン | ストーンコールド・スタナー |
| ブレット・ハート | アルバータ州カルガリー | シャープシューター |
| ランディ・サベージ | フロリダ州サラソタ | エルボードロップ |
| ベイダー | コロラド州ボルダー | ベイダーボム |
| レイザーラモン | サラソタ | レイザーズ・エッジ |

また、インラインコードの見栄えを良くする必要もあります。例えば、\`<span>\`要素について話したかったり、\`@tailwindcss/typography\`について良い知らせを伝
えたかったりする場合です。

### 見出しに\`code\`を使うこともある。

たとえそれが悪いアイデアだとしても、そして歴史的に、私はそれを良く見せるのに苦労してきた。しかし、この「コードブロックをバックティックで囲む」トリックはかなり
うまくいく。

[tailwindcss/docs](https://github.com/tailwindcss/docs)リポジトリについて教えたい場合などだ。バックティックの下にアンダーラインがあるのは好きではな
いが、それを避けるために必要な狂気には絶対に値しない。

#### 私たちはまだ \`h4\` を使っていません。

でも今は使っている。Mediumが2つの見出しレベルしかサポートしていないのには理由があるんだ。正直なところ、\`h5\`や\`h6\`を使ったら、\`before\`疑似要素を使っ
て怒鳴ろうかと思った。

なぜなら、\`h4\`要素はすでにとても小さく、本文のコピーと同じサイズだからだ。\`h5\`をどうしろというんだ？ボディコピーより_小さくしろというのか？結構です。

### でも、見出しを重ねることについてはまだ考える必要がある。

#### 要素で台無しにしないようにしよう。

ふぅ、運が良ければ、このテキストの上に見出しのスタイルができ、かなり見栄えが良くなります。ここで閉じ段落を追加して、きちんとした大きさのテキストブロックで物事
を終わらせよう。
`

export function useFileOperations(setHighlights: (highlights: Highlight[]) => void) {
  const [content, setContent] = useState(defaultContent);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
    };
    reader.readAsText(file);
    setHighlights([]);
  };

  const handleDownload = () => {
    const contentDiv = document.querySelector('.prose');
    if (!contentDiv) return;

    let mdContent = content;
    const marks = Array.from(contentDiv.getElementsByTagName('mark'));
    
    marks.forEach(mark => {
      const color = mark.style.backgroundColor;
      const text = mark.textContent;
      const highlightSyntax = `<mark style="background-color: ${color}">${text}</mark>`;
      mdContent = mdContent.replace(text!, highlightSyntax);
    });

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'highlighted-content.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    content,
    handleFileUpload,
    handleDownload,
  };
} 