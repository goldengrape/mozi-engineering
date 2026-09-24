VAR multi_answer = ""
VAR number_answer = 0
VAR rank_answer = ""

# ui:type=multi
# ui:bind=multi_answer
# ui:option=a|甲
# ui:option=b|乙
# ui:option=c|丙
# ui:min=1
# ui:max=2
# ui:submit=提交多选
请选择需要保留的项目。
* [继续]
    已记录多选：{multi_answer}
    -> number_step

=== number_step ===
# ui:type=number
# ui:bind=number_answer
# ui:min=0
# ui:max=10
# ui:step=1
# ui:unit=kg/h
# ui:submit=提交数值
请输入一个数值。
* [继续]
    已记录数值：{number_answer}
    -> rank_step

=== rank_step ===
# ui:type=rank
# ui:bind=rank_answer
# ui:option=a|步骤甲
# ui:option=b|步骤乙
# ui:option=c|步骤丙
# ui:submit=提交顺序
请安排三个步骤。
* [继续]
    已记录顺序：{rank_answer}
    -> END
