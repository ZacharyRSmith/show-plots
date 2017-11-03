declare type EpisodeT = {
  Episode: number,
  imdbID: string, // tt\d{7} (letters `tt` followed by digits)
  imdbRating: number, // 1.0 - 10.0
  Released: string, // yyyy-mm-dd
  Title: string,
};
declare type SeasonT = {
  Episodes: EpisodeT[]
};
declare type ShowT = {
  name: string
};
declare type ShowWrapperT = { data: ShowT, text: string, value: Object };

