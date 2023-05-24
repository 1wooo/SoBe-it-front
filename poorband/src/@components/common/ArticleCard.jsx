import React, { useState } from "react";
import { getArticleDetailData } from "../../../api/getArticleDetailData";
import { ARTICLE_DETAIL } from "../../../core/articleData";
import { CATEGORY } from "../../../core/expenditureCategory";
import { styled } from "styled-components";
import { TIER } from "../../../core/tierImage";
import { useQuery } from "react-query";

export default function ArticleCard(props) {
  const { articleSeq } = props;
  const nowTime = new Date();

  // 글 정보 가져오기
  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useQuery(["articleDetail", articleSeq], () => getArticleDetailData(articleSeq), {
    onSuccess: () => {
      console.log("Success");
    },
    onError: () => {
      console.log("Error");
    },
  });

  // 좋아요

  // 투표하기

  const [articleType, setArticleType] = useState(ARTICLE_DETAIL.articleType);
  const [status, setStatus] = useState(ARTICLE_DETAIL.status);
  const [isMine, setIsMine] = useState(ARTICLE_DETAIL.isMine);
  const [category, setCategory] = useState(ARTICLE_DETAIL.expenditureCategory);
  const [img, setImg] = useState(ARTICLE_DETAIL.imageUrl);
  const [isLiked, setIsLiked] = useState(ARTICLE_DETAIL.liked);
  const [isVoted, setIsVoted] = useState(ARTICLE_DETAIL.voted);

  return (
    <Wrapper>
      <ProfileContainer>
        <img id="profile-img" src={article?.user?.profileImageUrl} alt="프로필사진" />
        <div id="name-container">
          <p className="bold">{article?.user.nickname}</p>
          <p className="bold" id="userId">
            {article?.user?.userId}
          </p>
          <img id="tier-img" src={TIER[article?.user?.userTier]} alt="티어" />
          <p className="grey">• {article?.writtenDate}</p>
        </div>

        {/* 현재 시간과 비교해서 보여주기 */}
        {article?.status === 1 && <p className="grey status">전체 공개</p>}
        {article?.status === 2 && <p className="grey status">맞팔 공개</p>}
        {article?.status === 3 && <p className="grey status">비공개</p>}
        {article?.mine && <span class="material-symbols-outlined more">more_vert</span>}
        {/* 더보기 아이콘 넣기 */}
      </ProfileContainer>

      <TitleContainer>{article?.articleType === 1 ? <p>지출 내역</p> : <p>결재 내역</p>}</TitleContainer>

      {/* 지출 내역 - 날짜, 분류 */}
      {article?.articleType === 1 && (
        <>
          <DateContiner>
            <p className="category">날짜</p>
            <p>{article?.consumptionDate}</p>
          </DateContiner>

          <CategoryContainer>
            <p className="category">분류</p>
            <p className="content">{CATEGORY[category]}</p>
          </CategoryContainer>
        </>
      )}

      <ContextContainer>
        <p className="category">내용</p>
        <p className="content">{article?.articleText}</p>
      </ContextContainer>
      {article?.imageUrl && (
        <ImageContainer>
          <img src={article?.imageUrl} alt="이미지"></img>
        </ImageContainer>
      )}
      <PriceContainer>
        <p className="category">금액</p>
        <p className="content">{article?.amount?.toLocaleString("en-US")}원</p>
      </PriceContainer>

      {article?.articleType === 2 && (
        <VContatiner>
          {isVoted ? (
            <VoteResultContainer>
              <div className="container">
                <p>허가 {article?.agree}</p>
                <p>불허 {article?.disagree}</p>
              </div>

              <div className="container">
                <p>{article?.agreeRate}</p>
                <p>{article?.disagreeRate}</p>
              </div>

              {/* 그래프 */}
              <p>그래프</p>
            </VoteResultContainer>
          ) : (
            <VoteContainer>
              <button className="left">허가</button>
              <button className="right">불허</button>
            </VoteContainer>
          )}
        </VContatiner>
      )}

      <FooterContainer>
        <Like>
          {isLiked ? (
            <span class="material-symbols-rounded active">favorite</span>
          ) : (
            <span class="material-symbols-rounded">favorite</span>
          )}
          <p>{article?.likeCnt}</p>
        </Like>

        <Comment>
          <span class="material-symbols-rounded">comment</span>
          <p>{article?.commentCnt}</p>
        </Comment>
      </FooterContainer>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 3rem;
  ${({ theme }) => theme.shadows.card};
  p.category {
    font: ${({ theme }) => theme.fonts.medium};
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.darkgrey_1};
  }
  p.content {
    font: ${({ theme }) => theme.fonts.bold};
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.black};
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;
  margin: 1rem 0;

  #profile-img {
    width: 4rem;
    height: 4rem;
    border-radius: 1rem;
    margin: 0;
  }

  #name-container {
    width: 100%;
    display: flex;
    align-items: center;
    margin-left: 1rem;
  }
  p.bold {
    font: ${({ theme }) => theme.fonts.bold};
    margin: 0 0.5rem;
  }
  img {
    margin: 0 0.5rem;
  }
  p#userId {
    color: ${({ theme }) => theme.colors.darkgrey_1};
    margin: 0;
  }
  p.grey {
    font: ${({ theme }) => theme.fonts.medium};
    color: ${({ theme }) => theme.colors.darkgrey_1};
    margin-left: 1rem;
  }
  p.grey.status {
    margin-right: 0.5rem;
    width: 8rem;
    font: ${({ theme }) => theme.fonts.medium};

    color: ${({ theme }) => theme.colors.darkgrey_1};
    text-align: right;
  }

  .more {
    font-size: 2rem;
    margin: 0 1rem;
  }

  #tier-img {
    width: 2rem;
    height: 2rem;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.2rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.lightgrey_1};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightgrey_1};
  font: ${({ theme }) => theme.fonts.bold};
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.black};
  margin: 0.5rem;
`;

const DateContiner = styled.div`
  display: flex;
  padding: 1.2rem 0;
  justify-content: space-between;
  margin: 0.5rem;
  font: ${({ theme }) => theme.fonts.bold};
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.black};
`;
const CategoryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem;
  padding: 1.2rem 0;
  font: ${({ theme }) => theme.fonts.bold};
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.black};
`;
const ContextContainer = styled.div`
  display: flex;
  padding: 1.2rem 0;
  justify-content: space-between;
  margin: 0.5rem;
  font: ${({ theme }) => theme.fonts.bold};
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.black};
`;
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.5rem;
  img {
    width: 30rem;
    height: 30rem;
    border-radius: 1rem;
  }
`;
const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.2rem 0;
  margin: 0.5rem;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.lightgrey_1};
`;
const VContatiner = styled.div`
  margin: 1.5rem 0;
`;
const VoteContainer = styled.div`
  display: flex;
  justify-content: space-between;

  font-size: 1.6rem;

  padding: 0;
  button {
    width: 100%;
    height: 5rem;
    border-radius: 1.5rem;
    font: ${({ theme }) => theme.fonts.bold};
    background-color: ${({ theme }) => theme.colors.lightpurple};
  }
  button:hover {
    background-color: ${({ theme }) => theme.colors.mainpurple};
  }
  button:focus {
    outline: none;
  }
  button.left {
    margin-right: 1rem;
  }
`;
const VoteResultContainer = styled.div`
  display: flex;
  padding: 1rem;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.lightpurple};
  border-radius: 1.5rem;
  margin: 0.5rem;
  .container {
    margin: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

const FooterContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  p {
    font-size: 1.6rem;
    ${({ theme }) => theme.fonts.regular};
    color: ${({ theme }) => theme.colors.darkgrey_1};
  }
  span.material-symbols-rounded {
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.darkgrey_1};
  }
  span.active.material-symbols-rounded {
    color: ${({ theme }) => theme.colors.red};
  }
`;
const Like = styled.div`
  display: flex;
  margin: 0 2rem 0 0;
  align-items: center;
  p {
    font-size: 1.6rem;
    margin-left: 1rem;
  }
`;
const Comment = styled.div`
  display: flex;
  align-items: center;
  p {
    font-size: 1.6rem;
    margin-left: 1rem;
  }
`;
