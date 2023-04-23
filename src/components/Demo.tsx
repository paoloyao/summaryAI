import { useEffect, useState } from "react"
import { copy, linkIcon, loader, tick } from '../assets';
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState<DeepReadonlyObject<Article>>({
    url: '',
    summary: ''
  });
  const [allArticles, setAllArticles] = useState<DeepReadonlyObject<Article[]>>([]);
  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();
  const [clipBoard, setClipBoard] = useState('');

  useEffect(() => {
    const articleStore: string | null = localStorage.getItem('articles');
    const artcileFromLocalStorage: Article[] = articleStore 
      ? JSON.parse(articleStore) : '';

    if(artcileFromLocalStorage) setAllArticles(() => artcileFromLocalStorage);
  }, []);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error: errorSummary } = await getSummary({ articleUrl: article.url });
    if(data?.summary) {
      const newArticle: Article = { ...article, summary: data.summary };
      setArticle(() => newArticle);
      const allNewArticles: Article[] = [ newArticle, ...allArticles ];
      setAllArticles(() => allNewArticles);
      localStorage.setItem('articles', JSON.stringify(allNewArticles));
    }

    if(errorSummary){
      if ('data' in errorSummary){
        const errorSum: any = errorSummary;
        console.log(errorSum.data.error);
      }
    }
  };

  const handleCopy = (copyUrl: string) => {
    setClipBoard(() => copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => {
      setClipBoard(() => '');
    }, 2000);
  };

  const handleErrorDesc = (errorDesc: any) => errorDesc?.data?.error;

  return (
    <section className="w-full max-w-xl mt-16">
      <div className="flex flex-col w-full gap-2">
        <form
          action=""
          className="relative flex items-center justify-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link icon"
            className="absolute left-0 w-5 my-2 ml-3"
          />
          <input
            type="url"
            placeholder="Enterba URL"
            value={article.url}
            onChange={(e) => setArticle((prevState) => ({...prevState, url: e.target.value}))}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↩
          </button>
        </form>
        <div className="flex flex-col gap-1 overflow-y-auto max-h-60">
          {allArticles.map((item: Article, index: number) => (
            <div key={`link-${index}`}
              onClick={() => setArticle(() => item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={clipBoard === item.url ? tick : copy}
                  alt="copy icon"
                  className="w-[40%] h-[40%] object-contain"

                />
              </div>
              <p className="flex-1 text-sm font-medium text-blue-700 truncate font-satoshi">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center max-w-full my-10">
        { isFetching ? (
              <img src={loader} alt="loading img" className="object-contain w-20 h-20" /> 
            ) : error ? (
                  <p className="font-bold text-center text-black font-inter">
                    Well, that wasn't supposed to happen...
                    <br />
                    <span className="font-normal text-gray-700 font-satoshi">
                      { handleErrorDesc(error) }
                    </span>
                  </p>
                ) : (
                  article.summary && (
                    <div className="flex flex-col gap-3">
                      <h2 className="text-xl font-bold text-gray-600 font-satoshi">
                        Article <span className="blue_gradient">Summary</span>
                      </h2>
                      <div className="summary_box">
                        <p className="text-sm font-medium text-gray-700 font-inter">
                          {article.summary}
                        </p>
                      </div>
                    </div>
                  )
                )
      }
      </div>
    </section>
  )
}

export default Demo