import Markdown from 'marked-react'
import React from 'react'
import { ActionsAfterResult } from '~/components/ActionsAfterResult'
import Sentence from '~/components/Sentence'
import { useToast } from '~/hooks/use-toast'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { formatSummary } from '~/utils/formatSummary'

export let isSecureContext = false

if (typeof window !== 'undefined') {
  isSecureContext = window.isSecureContext
}

export function SummaryResult({
  currentVideoUrl,
  currentVideoId,
  summary,
  shouldShowTimestamp,
}: {
  currentVideoUrl: string
  currentVideoId: string
  summary: string
  shouldShowTimestamp?: boolean
}) {
  const { toast } = useToast()
  const formattedCachedSummary = summary?.startsWith('"')
    ? summary
        .substring(1, summary.length - 1)
        .split('\\n')
        .join('\n')
    : summary

  const { summaryArray, formattedSummary } = formatSummary(formattedCachedSummary)
  const summaryNote = formattedSummary + '\n\n#BibiGPT https://b.jimmylv.cn @吕立青_JimmyLv \nBV1fX4y1Q7Ux'

  const handleCopy = () => {
    if (!isSecureContext) {
      toast({ description: '复制错误 ❌' })
      return
    }
    navigator.clipboard.writeText(summaryNote)
    toast({ description: '复制成功 ✂️' })
  }

  const [clickCopy, setClickCopy] = useLocalStorage<boolean>('user-config-clickCopy') || false

  const clickCopyTest = () => {
    if (clickCopy) {
      handleCopy()
    } else {
      toast({ description: '点击复制功能没有被开启哦' })
    }
  }

  return (
    <div className="mb-8 px-4">
      <h3 className="m-8 mx-auto max-w-3xl border-t-2 border-dashed pt-8 text-center text-2xl font-bold sm:text-4xl">
        <a href={currentVideoUrl} className="hover:text-pink-600 hover:underline" target="_blank" rel="noreferrer">
          {`【📝 总结：${currentVideoId}】`}
        </a>
      </h3>
      <div
        className="mx-auto mt-6 max-w-3xl cursor-copy rounded-xl border-2 bg-white p-4 text-lg leading-7 shadow-md transition hover:bg-gray-50"
        onClick={clickCopyTest}
      >
        {shouldShowTimestamp ? (
          summaryArray.map((sentence: string, index: number) => (
            <div key={index}>
              {sentence.length > 0 && (
                <Sentence videoId={currentVideoId} videoUrl={currentVideoUrl} sentence={sentence} />
              )}
            </div>
          ))
        ) : (
          <div className="markdown-body">
            <Markdown>{formattedCachedSummary}</Markdown>
          </div>
        )}
      </div>
      <ActionsAfterResult
        curVideo={currentVideoUrl}
        onCopy={handleCopy}
        summaryNote={formattedSummary}
        clickCopy={clickCopy}
        setClickCopy={setClickCopy}
      />
    </div>
  )
}
