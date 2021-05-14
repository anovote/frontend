import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import StandardLayout from 'components/layout/Standard'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import chrisPicture from 'style/assets/christoffer.jpg'
import emilPicture from 'style/assets/emil.jpg'
import { ReactComponent as PurpleLine } from 'style/assets/purple-line.svg'
import sanderPicture from 'style/assets/sander.jpg'
import steffenPicture from 'style/assets/steffen.jpg'

export default function About(): ReactElement {
    const [t] = useTranslation(['site'])
    const team = [
        {
            name: 'Steffen Holanger',
            img: steffenPicture,
            username: 'spiftire',
        },

        {
            name: 'Emil Elton Nilsen',
            img: emilPicture,
            username: 'perkynades',
        },

        {
            name: 'Sander Hurlen',
            img: sanderPicture,
            username: 'sanderhurlen',
        },
        {
            name: 'Christoffer Andersen Træen',
            img: chrisPicture,
            username: 'freshfish70',
        },
    ]

    return (
        <StandardLayout wrapperClassName="about" contentClassName="about-layout-content-header">
            <div className="about-hero">
                <div className="site-layout-content">
                    <Title level={1} id="about-title">
                        {t('site:About us')}
                    </Title>
                </div>
                <PurpleLine id="purple-line" />
            </div>

            <div className="about-content">
                <div className="site-layout-content">
                    <Title level={1}>{t('site:The team')}</Title>
                    <div className="team-carousel">
                        {team.map((member, index) => {
                            return (
                                <span className="team-member" key={index}>
                                    <img
                                        src={member.img}
                                        className="member-image"
                                        alt={`Picture of ${member.name}`}
                                    ></img>

                                    <Title level={4}>{member.name}</Title>
                                    <a href={`http://github.com/${member.username}`}>{`@${member.username}`}</a>
                                </span>
                            )
                        })}
                    </div>
                    <section>
                        <Title level={1} id="how-it-started">
                            {t('site:How it all started')}
                        </Title>
                        <Text>{t('site:In 2018 the four students')}</Text>
                        <br />
                        <Text>{t('site:In 2021 the group')}</Text>
                        <Title level={3}>{t('site:Applied technology and methodologies')}</Title>
                        <Text>
                            {t('site:applied technology text')}
                            <ul>
                                <li>{t('site:Agile software development following SCRUM')}</li>
                                <li>{t('site:git and github')}</li>
                                <li>{t('site:tech on frontend')}</li>
                                <li>{t('site:tech on backend')}</li>
                                <li>{t('site:dockerize everything')}</li>
                                <li>{t('site:actions')}</li>
                                <li>{t('writing tests')}</li>
                            </ul>
                        </Text>
                    </section>
                </div>
            </div>
        </StandardLayout>
    )
}
