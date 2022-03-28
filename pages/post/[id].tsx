import React, { createElement, useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout/Layout";
import { useRouter } from "next/router";
import { Comment, Avatar, Form, Button, Tooltip, Input } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { postComment } from "../Redux-actions/Action";
// import styles from "../../styles/layout.module.css";
import Highlight from "react-highlight";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import toast,{Toaster} from 'react-hot-toast'
import ReactTimeAgo from "react-time-ago";
import styles from "../../styles/layout.module.css";

type COmment = {
  id:any;
  email:any;
  author:any;
  image:string;
  title:string
}


const id = () => {
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const [dataId, setDataId] = useState([]);
  const [comment, setComment] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);
  const router = useRouter();
  const [text, setText] = useState<string>("");

  let { id } = router.query;

 

  const addComment = (e: any) => {
    e.preventDefault();
    dispatch(postComment(text, id));
    setText('')
    toast.success('Commentar Berhasil')
  };

  useEffect(() => {
    axios
      .get(`https://blog-mern-api-node.herokuapp.com/api/post/${id}`)
      .then((res) => {
        setDataId(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [addComment]);

  const like = () => {
    setLikes(1);
    setDislikes(0);
    setAction("liked");
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction("disliked");
  };

  // ACTION COMMENTAR
  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {createElement(action === "liked" ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        {React.createElement(
          action === "disliked" ? DislikeFilled : DislikeOutlined
        )}
        <span className="comment-action">{dislikes}</span>
      </span>
    </Tooltip>,
    <span key="comment-basic-reply-to">Reply to</span>,
  ];
  // =======END========

  return (
    <Layout>
      <div className="container">
        <Toaster/>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{ margin:'auto', minHeight: "auto" }}
            className={`${styles.layout} ui card`}
          >
            <div className="image">
              <img src={dataId.image} />
            </div>
            <div className="content">
              <p style={{ fontWeight: "bold" }}>{dataId.author?.email}</p>
              <span className="right floated">
                {/* <i className="heart outline like icon"></i> */}
              </span>
              <h1 style={{ fontWeight: "bold", fontSize: "2.5rem" }}>
                {dataId.title}
              </h1>
              <Highlight className="language-name-of-snippet" innerHTML={true}>
                {dataId.text}
              </Highlight>
            </div>
            <div className="extra content">
              <h1 style={{ fontSize: "2.5rem" }}>Discussion</h1>
              <Form.Item>
                <TextArea
                  rows={4}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  key={dataId.author?._id}
                  onClick={addComment}
                  type="primary"
                >
                  Add Comment
                </Button>
              </Form.Item>
              {dataId.comments?.map((item: any, index: any) => {
                return (
                  <Comment
                    actions={actions}
                    author={<a> {item.author?.email}</a>}
                    avatar={
                      <Avatar
                        src="https://joeschmoe.io/api/v1/random"
                        alt="Han Solo"
                      />
                    }
                    content={<p style={{color:'#333'}}>{item.text}</p>}
                    datetime={
                      <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                        <span>{moment(item.date).fromNow()}</span>
                      </Tooltip>
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default id;
