
# gitlab 变量说明，  https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
# https://codeopolis.com/posts/sending-a-pushover-notification-at-the-end-of-a-gitlab-ci-pipeline/
# https://blog.csdn.net/weixin_44861399/article/details/118650108?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.no_search_link&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.no_search_link
# https://developers.dingtalk.com/document/robots/customize-robot-security-settings

title="「CI/CD」 ${CI_PROJECT_NAME}"
text="## ${title} \n #### <font size=4 >**构建分支：**</font>${CI_COMMIT_REF_NAME} \n #### <font size=4 >**注释标题：**</font>${CI_COMMIT_TITLE}\n #### <font size=4 >**注释内容：**</font>${CI_COMMIT_MESSAGE} \n #### <font size=4 >**提交者：**</font>${GITLAB_USER_NAME}(${GITLAB_USER_EMAIL}) \n\n\n #### <font size=4 >**流水线：**</font> [Pipeline #${CI_PIPELINE_ID}](${CI_PROJECT_URL}/pipelines/${CI_PIPELINE_ID}) \n <font size=4 >**Mushiny RMS Team**</font>\n"
curl "https://oapi.dingtalk.com/robot/send?access_token=${DINGDING_ACCESS_TOKEN}" \
 -H 'Content-Type: application/json' \
 -d "{\"msgtype\": \"markdown\",\"markdown\": {\"title\":\"$title\",\"text\": \"$text\"}}"

