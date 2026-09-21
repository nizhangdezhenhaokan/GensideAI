// 空会话只展示欢迎语，避免示例问答被误认为用户的真实对话。
import SmartFinanceAvatar from '@/assets/smart-finance-avatar.png'

export const FinanceChatWelcome = () => {
  return (
    <section
      className="finance-welcome-conversation"
      aria-label="智慧小财神欢迎语"
    >
      <div className="finance-prototype-message is-assistant">
        <img
          src={SmartFinanceAvatar}
          alt="智慧小财神"
          className="finance-prototype-avatar"
        />
        <div className="finance-prototype-bubble finance-prototype-ai-bubble">
          您好！我是<strong>智慧小财神</strong>
          。我可以接受任务指令和问答指令，请随时向我发送任务指令或咨询业务问题。
        </div>
      </div>
    </section>
  )
}
