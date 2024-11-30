export const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 3,
  arrows: true,
  responsive: [
    {
      breakpoint: 2560,
      settings: {
        slidesToShow: 6.5,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 1920,
      settings: {
        slidesToShow: 5.5,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 1536,
      settings: {
        slidesToShow: 5.5,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 4.5,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3.5,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2.5,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 2.5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1.5,
        slidesToScroll: 1,
      },
    },
  ],
};
