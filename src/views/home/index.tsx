import { ArrowRightOutlined, FileTextTwoTone, PieChartTwoTone, ScheduleTwoTone } from '@ant-design/icons'
import { Layout, Space } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import Navigation from 'components/home/Navigation'
import { getPublicRoute } from 'core/routes/siteRoutes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ReactComponent as Lines } from 'style/assets/lines.svg'
import { ReactComponent as LockIcon } from 'style/assets/lock-with-effect.svg'
import showCase from 'style/assets/showcase@2x.png'

/**
 * Landing page of application and home root
 * @returns the landing page view
 */
export default function Home(): React.ReactElement {
    const { about, register } = getPublicRoute()
    const [t] = useTranslation(['site', 'navigation'])

    const howAnovoteWorksData = [
        {
            icon: <FileTextTwoTone twoToneColor="#edbf5b" />,
            title: t('site:Create'),
            text: t('site:Create paragraph'),
        },
        {
            icon: <ScheduleTwoTone twoToneColor="#758BFD" />,
            title: t('site:Organize'),
            text: t('site:Organize paragraph'),
        },
        {
            icon: <PieChartTwoTone twoToneColor="#00EBB1" />,
            title: t('site:Get Results'),
            text: t('site:Results paragraph'),
        },
    ]

    return (
        <div className="home">
            <Layout>
                <Header>
                    <Navigation />
                </Header>
                <Content>
                    <section className="hero">
                        <span className="title-with-action">
                            <Title level={1} className="title-box">
                                {t('site:Time to elect new board')}
                            </Title>
                            <Link to={register} id="organize-election">
                                <ArrowRightOutlined className="right-arrow" />
                                {t('site:Organize your first election')}
                            </Link>
                        </span>
                        <span className="showcase">
                            <img src={showCase} alt={t('site:Showcase of the elections view panel')} />
                        </span>
                        <Lines id="lines-background-effect" />
                    </section>

                    <div className="content">
                        <section id="how-anovote-works">
                            <Title level={1}>How Anovote works</Title>
                            <Space wrap={true} className="principles">
                                {howAnovoteWorksData.map((data, index) => {
                                    return (
                                        <article key={index}>
                                            <span className="principle-icon">{data.icon}</span>
                                            <span className="principle-text">
                                                <Title level={3}>{data.title}</Title>
                                                <Text>{data.text}</Text>
                                            </span>
                                        </article>
                                    )
                                })}
                            </Space>
                        </section>
                        <section id="anovote-backstory">
                            <Title level={1}>{t('site:Anovote anonymous voting')}</Title>
                            <Space wrap={true} align="center" className="backstory-content">
                                <article className="backstory">
                                    <Text>
                                        Anovote was develop with the intention of performing as secure and anonymous
                                        voting for everyone.
                                    </Text>
                                    <br />
                                    <Text>
                                        All packed in to an simple and elegant solution for everyone to use. Now you can
replace pen and paper, with your mobile phone and computer!😊
                                    </Text>
                                </article>
                                <span className="article-image">
                                    <LockIcon />
                                </span>
                            </Space>
                        </section>
                        <section id="about">
                            <Title level={1}>{t('site:About Anovote')}</Title>
                            <article>
                                <Text>
                                    Anovote was developed as a bachelor thesis project in 2021. The idea was established
                                    in 2019, and a prototype was developed. In the pursue for a greater project, the
                                    group decided to start over and take on the project as a bachelor thesis project.
                                </Text>
                                <Link to={about} id="organize-election">
                                    <ArrowRightOutlined className="right-arrow" />
                                    {t('navigation:Read more')}
                                </Link>
                            </article>
                        </section>
                    </div>
                </Content>
                <Footer className="text-label is-flex justify-content-center">
                    © Anovote {new Date().getFullYear()}
                </Footer>
            </Layout>
        </div>
    )
}
