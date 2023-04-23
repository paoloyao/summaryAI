// ref builder.io/blog/utility-types
type DeepReadonly<T> =
  T extends Primitive ? T :
  T extends Array<infer U> ? DeepReadonlyArray<U> :
  DeepReadonlyObject<T>

type Primitive = 
  string | number | boolean | undefined | null

interface DeepReadonlyArray<T> 
  extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

type ParamsSummarize = {
  articleUrl: string
};

type Article = {
  url: string,
  summary: string
};

type ArticleErrorSummary = {
  data: {
    error: string
  },
  status: number
}